const express = require('express');
const app = express();

const mongoose = require('mongoose');
const animedb = require('./models/database.js');
var AnimeChar = require('./models/anime_char');
const flash = require('connect-flash');
const session = require('express-session');

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');


require('./controller/passport')(passport);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); // get information from html forms


app.use(session({
  secret: 'Aiel9114',
  resave: false,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs');

require('./controller/routes.js')(app, passport);


app.listen(3000, function(err){
  if(err){
    console.log('Error: ', err);
  } else {
    console.log('Connected');
  }
})
