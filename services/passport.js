const passport = require('passport');
const GoogleStrategy = require ('passport-google-oauth20');
const mongoose = require('mongoose');
const config = require('../config');

const User = mongoose.model('users')

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser((userId, done)=>{
    User.findById(userId).then(existingUser=> {
        done(null, existingUser)
    });
})

passport.use(new GoogleStrategy({
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: '/auth/google/callback' //can be any route we want, this one just makes the most sense.
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleID: profile.id}).then( existingUser => {
            if(existingUser){
               return done(null, existingUser)
            }
            new User({googleID: profile.id}).save().then( newUser => {
                done(null, newUser);
            });
        })
}));
