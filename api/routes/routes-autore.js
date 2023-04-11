const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Author = require('../models/Autore');

const cloudMulter = require('../middleware/cloudMulter');

const sendMail = require('../middleware/email');
const jwt_secret = process.env.JWT_SECRET;

router.get('/api/authors', async (req, res, next) => {
    const userRequestId = req.body.id;
    const userRequestBy = await Author.findById(userRequestId);
    console.log("get authors ", userRequestBy);
    if (!userRequestBy.isAdmin) {
        return next(new Error("No auth"));
    }
    try {
        const {page = '1', size = '4'} = req.query;
        const result = await Author.find()
                    .skip((Number(page)-1) * Number(size))
                    .limit(Number(size));
        const count = await Author.count();
        return res.json({count, results: result});
    } catch (err) {
        next(err)
    }
});
router.get('/api/authors/:id', async (req, res, next) => {
    console.log("get authors/:id ");
    const {id} = req.params;
    const userRequestId = req.body.id;
    const userRequestBy = await Author.findById(userRequestId);
    if (!userRequestBy.isAdmin) {
        return next(new Error("No auth"));
    }
    let result;
    try {
        result = await Author.findById(id);
        return res.json(result);
    } catch (err) {
        next(err)
    }
    
});
router.patch('/api/authors/:id/avatar', cloudMulter.single('avatar'), async (req, res) => {
    console.log("patch authors/:id/avatar ");
    const {id} = req.params;
    const userRequestId = req.body.id;
    const userRequestBy = await Author.findById(userRequestId);
    if (!userRequestBy.isAdmin) {
        return next(new Error("No auth"));
    }

    let result;
    try {
        if(req.file){
            const result = await Author.updateOne({_id: id},{ avatar: req.file.path});

            console.log("result ",result);
        }
        result = await Author.findById(id);
        return res.json(result);
    } catch (err) {
        next(err)
    }

});
router.post('/api/authors', async (req, res, next) => {
    console.log("post authors ");
    const body = req.body;
    const password = req.body.password;
    const userRequestId = req.body.id;
    const userRequestBy = await Author.findById(userRequestId);
    if (!userRequestBy.isAdmin) {
        return next(new Error("No auth"));
    }
    const saltRounds = 10;
    try {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err){
                return next(err);
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if(!err){
                    // Store hash in your password DB.
                    const newAuthor = new Author({...body, password: hash});
                    const result = newAuthor.save();
                    if(result && body.email){
                        const msg = {
                            to: newAuthor.email,
                            subject: 'Registrazione avvenuta con successo',
                            text: 'Grazie per esserti registrato',
                            html: '<strong>Grazie per esserti registrato</strong>',
                        };
                        await sendMail(msg);
                    }
                    return res.status(201).json({result});            
                } else {
                    return next(err);
                }
            });
        });
    } catch (err) {
        next(err);
    }
    
});
router.put('/api/authors/:id', async (req, res, next) => {
    console.log("put authors/:id ");
    const {id} = req.params;
    const body = req.body;
    const userRequestId = req.body.id;
    const userRequestBy = await Author.findById(userRequestId);
    if (!userRequestBy.isAdmin) {
        return next(new Error("No auth"));
    }
    try {
        const author = await Author.findById(id);
        console.log("author=> ",author);
        const result = await Author.updateOne({_id: author._id},{...body});
        console.log('modified ', result.modifiedCount)
        return res.json(result);
    } catch (err) {
        next(err)
    }
    
});
router.delete('/api/authors/:id', async (req, res, next) => {
    console.log("delete authors/:id ");
    const {id} = req.params;
    const userRequestId = req.body.id;
    const userRequestBy = await Author.findById(userRequestId);
    if (!userRequestBy.isAdmin) {
        return next(new Error("No auth"));
    }
    try {
        const author = await Author.findByIdAndDelete(id);
        return res.json(author);
    } catch (err) {
        next(err)
    }
});

router.post('/api/login', async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const author = await Author.findOne({email: username});
        if(author){
            const check = bcrypt.compare(password, author.password);
            if(check){
                const token = jwt.sign({ id: author._id, 
                                        nome: author.nome, 
                                        cognome: author.cognome,
                                        email: author.email,
                                        isAdmin: author.isAdmin,
                                    }, jwt_secret);
                return res.status(200).json({token});
            } else {
                next(new Error("Password is incorrect"))
            }
        } else {
            return next(new Error("User is incorrect"))
        }
    } catch (err) {
        next(err)
    }
});
// router.post('/logout', async (req, res, next) => {
//     req.logout( (err) => {
//       if (err) { return next(err); }
//       res.redirect('http://localhost:3001');
//     });
// });
module.exports = router;