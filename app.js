const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI)
    .then(() => {
        console.log('mongoDB connected.');
    })
    .catch((e) => {
        console.log(e);
    })

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)

module.exports = app;