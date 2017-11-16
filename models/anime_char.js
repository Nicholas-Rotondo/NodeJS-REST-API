const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var animeCharSchema = mongoose.Schema({

  local            : {
      email        : String,
      password     : String,
  },
  facebook         : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  },
  twitter          : {
      id           : String,
      token        : String,
      displayName  : String,
      username     : String
  },
  google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  },
  soundcloud       : {
    id             : String,
    token          : String,
    email          : String,
    name           : String
  }

});

animeCharSchema.methods.createHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(), null);
};

// checking if password is valid
animeCharSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('AnimeChar', animeCharSchema);
