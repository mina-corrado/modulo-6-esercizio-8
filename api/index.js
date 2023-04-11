const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors')
require('dotenv').config();
//console.log(process.env)
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const url = require('url');

// const SQLiteStore = require('connect-sqlite3')(session);
const MongoStore = require('connect-mongo');

//routes
const routesBlogPost = require('./routes/routes-blogpost');
const routesAutore = require('./routes/routes-autore');
const routesComment = require('./routes/routes-comment');
const routesOauth = require('./routes/routes-oauth');

//middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());

const unless = (middleware, ...paths) => {
    return (req, res, next) => {
        // console.log("req => ",req)
        const pathCheck = paths.some(path => {
            return path === req.path || path.concat('/') === req.path;
        });
        pathCheck ? next() : middleware(req, res, next);
    };
};

app.use(logger);
app.use(errorHandler);
app.use(unless( auth, '/login','/oauth/google', '/oauth/redirect/google', '/favicon.ico' ));

app.use(routesBlogPost);
app.use(routesAutore);
app.use(routesComment);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
    res.sendFile("./public/favicon.ico");
});

const start = async() => {
    try {
        await mongoose.connect('mongodb+srv://minacorrado:SW14D3KwA2WilPUH@cluster0.oopravd.mongodb.net/Epicode');
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                client: mongoose.connection.getClient()
            })
          }));
        app.use(passport.authenticate('session'));
          
        app.use(routesOauth);

        app.listen(process.env.PORT, () => {
            console.log("listening on port 3000")
        });    
    } catch (error) {
        console.log("error: ", error);    
    }
}

//avvio
start();

module.exports = app;