const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const config = require('./config');

mongoose.connect(config.db_connect).then(()=> {
    console.log('connected to MongoDB')
}).catch(err=>{
    console.log('error connecting to DB', err.message)
})

const PORT = process.env.PORT || 5150;

const app = express();

app.use(cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [config.cookieKey]
}));

app.use(passport.initialize());

app.use(passport.session());

require('./model/user');

require('./services/passport');

require('./routes/auth')(app);

app.listen(PORT, ()=> {
    console.log('server running on port ', PORT)
})
