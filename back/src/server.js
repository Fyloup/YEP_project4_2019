const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

mongoose.connect('mongodb://localhost:27017/')
mongoose.connection.once('open', function() {
    console.log('connected to db')
    
})


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());

const UserRoute = require('./routes/users');
app.use('/users', UserRoute);

const VideoRoute = require('./routes/video');
app.use('/video', VideoRoute);

const TwitchRoute = require('./routes/twitch');
app.use('/twitch', TwitchRoute);

const UploadRoute = require('./routes/uploadFile');
app.use('/upload', UploadRoute);


const SuggestionRoute = require('./routes/suggestion');
app.use('/videoList', SuggestionRoute);

const wikiRoute = require('./routes/wikiSearch');
app.use('/wiki', wikiRoute);

const youtubeRoute = require('./routes/Youtube');
app.use('/youtube', youtubeRoute);

module.exports = app.listen(3001);
