const express = require('express');
const multer = require('multer');
const router = express.Router();

const BlogPost = require('../models/BlogPost');
const Author = require('../models/Autore');

const cloudMulter = require('../middleware/cloudMulter');

const sendMail = require('../middleware/email');

router.get('/blogPosts', async (req, res, next) => {
    const {page = '1', size = '4'} = req.query;
    const result = await BlogPost.find()
            .populate("author")
            .skip((Number(page)-1) * Number(size))
            .limit(Number(size));
    const count = await BlogPost.count();
    return res.json({count, results: result});
});

router.get('/blogPosts/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const result = await BlogPost.findById(id).populate('comments', 'author');
        return res.json(result);
    } catch (error) {
        next(error)
    }
});

router.patch('/blogPosts/:id/cover', cloudMulter.single('cover'), async (req, res, next) => {
    const {id} = req.params;
    try {
        // console.log(req.file);
        if(req.file){
            const result = await BlogPost.updateOne({_id: id}, { cover: req.file.path });
            
            console.log("result ",result);
        }
        const post = await BlogPost.findById(id);
        return res.json(post);
    } catch (error) {
        next(error)
    }
});

router.post('/blogPosts', async (req, res, next) => {
    const body = req.body;
    console.log(`body is `, body)
    try {
        let author;
        if (!body.author._id){
            author = new Author({
                ...body.author
            });
            await author.save();
        } else {
            author = await Author.findById(body.author._id);
        }
        const post = new BlogPost({
            category: body.category,
            title: body.title,
            cover: body.cover || 'https://placekitten.com/640/360',
            readTime: {
                value: body.readTime && body.readTime.value || 1,
                unit: "minuti"
            },
            author,
            content: body.content,
        });
        await post.save();
        // console.log('post ',post);
        if(post){
            const msg = {
                to: author.email,
                subject: 'Nuovo post pubblicato',
                text: 'Hai appena pubblicato un nuovo post',
                html: '<strong>Hai appena pubblicato un nuovo post</strong>',
            };
            await sendMail(msg);
        }
        return res.status(201).json(post);
    } catch (error) {
        next(error)
    }
});

router.put('/blogPosts/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const body = req.body;

        const userRequestId = req.body.id;
        const userRequestBy = await Author.findById(userRequestId);

        const post = await BlogPost.findById(id);
        if (userRequestBy._id!==post.author._id) {
            return next(new Error("No permission to modify"));
        }

        const {author, ...restBody} = body;
        let authorObj = Author.findById(author._id);
        if (authorObj) {
            // modifica
            await Author.updateOne({_id: author._id}, {...author});
        } 
        const result = await BlogPost.updateOne({_id: post._id}, { ...restBody });

        return res.json(result)
    } catch (error) {
        next(error)
    }
});

router.delete('/blogPosts/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        const userRequestId = req.body.id;
        const userRequestBy = await Author.findById(userRequestId);
        
        const post = await BlogPost.findById(id);
        if (userRequestBy._id!==post.author._id) {
            return next(new Error("No permission to delete"));
        }

        const postDeleted = await BlogPost.findByIdAndDelete(id)
        return res.json(postDeleted);
    } catch (error) {
        next(error)
    }
});

module.exports=router;