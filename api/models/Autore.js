const mongoose = require('mongoose');
const autoreSchema = new mongoose.Schema({
    // _id: {type: String, required: true},
    nome: {type: String, required: true},
    cognome: {type: String, required: true},
    email: {type: String, required: false},
    data_di_nascita: {type: String, required: false},
    avatar: {type: String, required: false},
    password: {type: String, required: false},
    verified: {type: Boolean, required: false, default: false},
    isAdmin: {type: Boolean, required: false, default: false},
    issuer: {type: String, required: false},
});
module.exports = mongoose.model('Autore', autoreSchema);