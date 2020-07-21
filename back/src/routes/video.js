const express = require('express');
const router = express.Router();
const passwordHash = require("password-hash");
var ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');
// const Favorite = require('../models/users');

const jwt = require('jsonwebtoken');
const axios = require('axios');

var verifyToken = require('../auth/auth');
const apiVideo = require('@api.video/nodejs-sdk');
const client = new apiVideo.ClientSandbox({ apiKey: 'kE6hpeDghC7MQsUDpINdVIvXZ2e5sFrIsFqLMGzvoOy' });


router.post('/upload', verifyToken, async (req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })

    let result = client.videos.upload(req.body.videoLink, {title: req.body.title, description: req.body.description});
    result.then(async function(video) {
        const findUser = await User.updateOne({_id: _id},
            {$push: {
            "myVideos" : {
                "title" : video.title,
                "uri" : video.assets.player,
                "description" : video.description,
                "publishedAt" : video.publishedAt
            }
        }});
        res.send(video);
    }).catch(function(error) {
        console.error(error);
    });

});

router.get('/search', async (req, res) => {
    let result = client.videos.search({ title: req.query.title, tags: req.query.tags});
    var buff = []

    result.then(function(videos) {
     for (let x = 0; x < videos.length; x += 1) {
       if (Object.prototype.hasOwnProperty.call(videos, x)) {
         let video = videos[x];
         buff.push(video)
        }
    }
    res.send(buff);
});
});

module.exports = router;
