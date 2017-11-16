var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// var SoundCloudStrategy = require('passport-soundcloud').Strategy;
var AnimeChar = require('../models/anime_char');
const animedb = require('../models/database');

var controllerAuth = require('./auth');



module.exports = function(passport) {

      passport.serializeUser(function(user, done) {
          done(null, user.id);
      });

      // used to deserialize the user
      passport.deserializeUser(function(id, done) {
          AnimeChar.findById(id, function(err, user) {
              done(err, user);
          });
      });


      passport.use('local-signup', new LocalStrategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField : 'email',
          passwordField : 'password',
          passReqToCallback : true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {

  		// find a user whose email is the same as the forms email
  		// we are checking to see if the user trying to login already exists
          AnimeChar.findOne({ 'local.email' :  email }, function(err, user) {
              // if there are any errors, return the error
              if (err)
                  return done(err);

              // check to see if theres already a user with that email
              if (user) {
                  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
              } else {

  				// if there is no user with that email
                  // create the user
                  var newAnimeChar = new AnimeChar();

                  // set the user's local credentials
                  newAnimeChar.local.email    = email;
                  newAnimeChar.local.password = newAnimeChar.createHash(password); // use the createHash function in our animeChar model

  				// save the user
                  newAnimeChar.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newAnimeChar);
                  });
              }

          });

      }));

      passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      AnimeChar.findOne({ 'local.email' :  email }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no user is found, return the message
          if (!user)
              return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

          // if the user is found but the password is wrong
          if (!user.validPassword(password))
              return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, user);
      });

  }));


    passport.use(new FacebookStrategy({
      clientID: controllerAuth.facebookAuth.clientID,
      clientSecret: controllerAuth.facebookAuth.clientSecret,
      callbackURL: controllerAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'name', 'photos', 'emails']
    },
    function(token, refreshToken, profile, done) {

      process.nextTick(function(){

          AnimeChar.findOne({ "facebook.id": profile.id }, function (err, user) {
                if(err)
                  return done(err);

                if(user) {
                  return done(null, user);
                } else {

                  var newAnimeChar = new AnimeChar();
                  // set all of the facebook information in our user/AnimeChar model
                  //
                    newAnimeChar.facebook.id    = profile.id; // set the users facebook id
                    newAnimeChar.facebook.token = token; // we will save the token that facebook provides to the user
                    newAnimeChar.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newAnimeChar.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned

                    // save our user to the database
                    newAnimeChar.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newAnimeChar);
                    });
                }
            });
          });
        }
      ));

      // passport.use(new SoundCloudStrategy({
      //   clientID: controllerAuth.soundcloudAuth.clientID,
      //   clientSecret: controllerAuth.soundcloudAuth.clientSecret,
      //   callbackURL: controllerAuth.soundcloudAuth.callbackURL
      // },
      // function(token, refreshToken, profile, done) {
      //   process.nextTick(function(){
      //     //complete this not when high
      //     AnimeChar.findOne({"soundcloud.id": profile.id}, function(err, user){
      //       if(err)
      //         return done(err);
      //
      //       if(user) {
      //         return done(null, user);
      //       } else {
      //
      //         var newAnimeChar = new AnimeChar();
      //         newAnimeChar.soundcloud.id = profile.id;
      //         newAnimeChar.soundcloud.token = token;
      //         newAnimeChar.soundcloud.emails = profile.emails.value;
      //         newAnimeChar.soundcloud.name = profile.name.givenName + " " + profile.name.familyName;
      //
      //         newAnimeChar.save(function(err) {
      //           if (err)
      //             throw err;
      //
      //             return done(null, newAnimeChar);
      //         });
      //       }
      //     });
      //   });
      // }
    // ));

};
