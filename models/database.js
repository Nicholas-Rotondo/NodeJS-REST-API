const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const AnimeChar = require('./anime_char');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://Saitama:cityA1@localhost/anime');
const animedb = mongoose.connection;


animedb.on('error', console.error.bind(console, 'Connection Error: '));
animedb.once('open', function(){
  console.log('Running smoothly');
});
