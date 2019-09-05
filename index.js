const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const key = require('./config/keys');
const config = require('config');
const localStrategy = require('./middlewares/passport-local');
const sessionPersistent = require('./startup/session');
const googleStrategy = require('./middlewares/passport-google');
const passport = require('passport');


app.set('view engine','ejs');             //app.use(express.urlencoded);  //converts url encoded params to key value pair
app.use('/static', express.static('static'));   //this is to fool the client that there is a satic file on the server

// these are to initiate the passport local strategy

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionPersistent);

app.use(passport.initialize());

app.use(passport.session(),(req,res,next) =>{
   console.log('session called' );
   next();
});


// starts up mongodb
require('./startup/db')(app);

// i'm clueless abt this
require('express-async-errors');

// starts up routes
require('./startup/routes')(app);


// to handle uncaught Exceptions
process.on('uncaughtException',(ex)=>{
    console.log("There was some uncaught exception" + ex);
})

// this would allow us to get different configuration settings at different stages of development
// i.e testing , development , deployed etc ,
// console.log('Application name : '+config.get('name'));
// console.log('Application name : '+config.get('mail.host'));


app.listen(port,()=>{
    console.log(`Listening on ${port}...`);
});
