'use strict'
require('dotenv').config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const favicon = require("serve-favicon");
const session = require("express-session");
const multer = require("multer");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysqlStore = require("express-mysql-session")(session);
const sessionStore = new mysqlStore({/*default options for session*/}, require("./conf/database.js"));

// Establish Routes
const indexRouter = require("./routes/index.js");
const usersRouter = require("./routes/users.js");
const fetchRouter = require("./routes/fetch.js");
const postsRouter = require("./routes/posts.js");
const searchRouter = require("./routes/search.js");

const app = express();
app.use(express.static(__dirname));

const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3001', 'http://35.230.105.197:3000'],
  credentials: true,
}));

app.use(function(req, res, next) {
  const origin = req.headers.origin;
  if (['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3001', 'http://35.230.105.197:3000'].includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MIDDLEWARE FUNCTIONS
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({
    secret: process.env.COOKIEKEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false,
    }
}));

app.use(function(req,res,next){
  if(req.session.user){
    res.locals.isLoggedIn = true,
    res.locals.user = req.session.user
  }
  next();
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use("/",        indexRouter);
app.use("/users",   usersRouter);
app.use("/posts", postsRouter);
app.use("/fetch",   fetchRouter);
app.use("/search",  searchRouter);




// Catch all error route
app.use((req,res,next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
});

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  next(err);
});

module.exports = app;
