const express = require('express');
const router = express.Router();
const passwordHash = require("password-hash");
var ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');
// const Favorite = require('../models/users');

const jwt = require('jsonwebtoken');
const axios = require('axios');

var verifyToken = require('../auth/auth');


router.get('/TopGames', async (req, res) => {
    try {

        axios({
            "method":"GET",
            "url":"https://api.twitch.tv/helix/games/top",
            "headers":{
            "content-type":"application/octet-stream",
            "Authorization": "Bearer qzozcc2zz2i060sjdzngzvl8arkek6",
            "Client-ID" :"eoz131t7qb2vongoc8gbng6bklpnzi"            }
        })
        .then((response)=>{
            res.json(response.data)
        })
        .catch((error)=>{
            res.json(error)    
        })
    }
        catch(err) {
            res.json({message: "error request"});
    };

});

router.post('/GetAUTH', async (req, res) => {
  
    try {

        axios({
            "method":"POST",
            "url":"https://id.twitch.tv/oauth2/token?client_id=eoz131t7qb2vongoc8gbng6bklpnzi&client_secret=mvnu9evtu76kpvapmdg4wv7bj0dt08&grant_type=client_credentials"
        })
        .then((response)=>{
            res.json(response.data)
        })
        .catch((error)=>{
            res.json(error)    
        })
    }
        catch(err) {
            res.json({message: "error request"});
    };
});

router.get('/Streams/:gameId', async (req, res) => {
    try {
            axios({
            "method":"GET",
            "url":"https://api.twitch.tv/helix/streams?game_id="+ req.params.gameId + "&language=fr",
            "headers":{
            "content-type":"application/octet-stream",
            "Authorization": "Bearer qzozcc2zz2i060sjdzngzvl8arkek6",
            "Client-ID" :"eoz131t7qb2vongoc8gbng6bklpnzi"            }
        })
        .then((response)=>{
            res.json(response.data)
        })
        .catch((error)=>{
            res.json(error)    
        })
    }
        catch(err) {
            res.json({message: "error request"});
    };

});

router.post('/follow', verifyToken, async (req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })
    const updateProfile = await User.updateOne(
        {_id: _id},
        {$push: {
            "twitchStreams": {
                "name" : req.body.name,
                "userId" : req.body.userId
            }
        }},
    );
    res.json(updateProfile);
});

router.get('/favStreams', verifyToken, async (req, res) => {
    var twitchStreams = [];
    var result = [] ;
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })
    const updateProfile = await User.findOne(
        {_id: _id}
    );
    twitchStreams = updateProfile.twitchStreams

   
    for (let item of twitchStreams) {
        await axios({
            "method":"GET",
            "url":"https://api.twitch.tv/helix/users?login=" + item.name,
            "headers":{
            "content-type":"application/octet-stream",
            "Authorization": "Bearer qzozcc2zz2i060sjdzngzvl8arkek6",
            "Client-ID" :"eoz131t7qb2vongoc8gbng6bklpnzi"
        }})
        .then((response)=>{
            result.push(response.data)
        })
        .catch((error)=>{
            res.json(error);  
        })
    }
    res.json(result);
});

router.delete('/remove', verifyToken, async(req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })
    const updateProfile = await User.updateOne(
        {"twitchStreams.name": req.body.name},
        {$pull: {
            "twitchStreams": {
                "name": req.body.name
            }
        }},
    );
    res.json(updateProfile);
});



module.exports = router;
