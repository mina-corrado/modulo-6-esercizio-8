const express = require('express');
const multer = require('multer');
const router = express.Router();

const Author = require('../models/Autore');


router.get('/api/me', async (req, res) => {
    const {id} = req.body.id;
    let result;
    try {
        result = await Author.findById(id);
        return res.json(result);
    } catch (err) {
        next(err)
    }
});


module.exports = router;