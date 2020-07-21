const express = require('express');
const mongoose = require('mongoose');
const passwordHash = require("password-hash");

// const Favorite = require('./favorites');

const FavoritesSchema = mongoose.Schema({
    source :
    {
        id : String,
        name : String,
    },
    author : String,
    title : String,
    description : String,
    url : String,
    urlToImage : String,
    publishedAt: String,
    content : String

});

const UserSchema = mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    surname:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        sparse:true

    },
    password:
    {
        type: String,
        required: true
    },
    videoList : [{
        title : String,
        path : String,
        description : String

    }],
    myVideos: [{
        title : String,
        uri : String,
        description : String,
        publishedAt : String
    }],
    twitchStreams :[{
        name : String,
        userId : String
    }],
    WatchList : [{
        "id": String,
        "name": String,
        "permalink": String,
        "start_date": String,
        "end_date": String,
        "country": String,
        "network": String,
        "status": String,
        "image_thumbnail_path": String
    }],
    wikiList :[{
        name : String,
        url : String
    }],
    youtubeSearch :[{
        name: String
    }]

});

UserSchema.methods = {
    authenticate: function(password) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function() {
        return jwt.encode(this, config.secret);
    }
};


module.exports = mongoose.model('User', UserSchema);
// module.exports = mongoose.model('Favorite', FavoritesSchema);

