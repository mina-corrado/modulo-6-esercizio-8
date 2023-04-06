const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const Author = require('../models/Autore');
const router = express.Router();

passport.use(new GoogleStrategy({
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: '/oauth/redirect/google',
        scope: ['profile', 'email']
    }, 
    async function verify (issuer, profile, next) {
        // console.log(`Profile ${JSON.stringify(profile)}`);
        let email;
        if (profile.emails && profile.emails.length > 0){
            email = profile.emails[0].value;
        }
        const user = await Author.findOne({email: email});
        console.log(`User ${user}`);
        if (!user){
            const newAutore = new Author({
                nome: profile.name.givenName, 
                cognome: profile.name.familyName,
                verified: true,
                issuer: issuer,
                email
            }); 
            newAutore.save();
            next(null, newAutore);
        } else {
            // esiste già
            if (issuer.includes('accounts.google.com')) {
                console.log('Issuer ',issuer);
                next(null, user);
            }else{
                next(null, false);
            }
                
        }
    })
);
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

router.get('/oauth/google', passport.authenticate('google'));
router.get('/oauth/redirect/google', 
    passport.authenticate('google', {failureRedirect: 'http://localhost:3001/login'}), (req, res) => {
        // console.log('Res *****************', res);
        const author = req.user;
        console.log('Author mail ', author.email);
        const token = jwt.sign({ id: author._id, 
            nome: author.nome, 
            cognome: author.cognome,
            email: author.email,
            isAdmin: author.isAdmin,
        }, jwt_secret);
        res.status(200).redirect(`http://localhost:3001/validateToken/${token}`);
});


module.exports = router;