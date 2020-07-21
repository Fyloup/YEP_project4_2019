const express = require('express');
const router = express.Router();
const passwordHash = require("password-hash");
var ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');

const jwt = require('jsonwebtoken');
const axios = require('axios');

var verifyToken = require('../auth/auth');

router.get('/topShow', async (req, res) => {
    await axios({
        "method":"GET",
        "url":"https://www.episodate.com/api/most-popular?page=" + req.param.page,
        "headers":{
        "content-type":"application/octet-stream"
    }})
    .then((response)=>{
        res.json(response.data)
    })
    .catch((error)=>{
        res.json(error);  
    })
});

router.post('/addToWatchlist', verifyToken, async (req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })

    try {
        const findUser = await User.updateOne({_id: _id},
            {$push: {
                "WatchList" : {
                    "id": req.body.id,
                    "name": req.body.name,
                    "permalink": req.body.permalink,
                    "start_date": req.body.start_date,
                    "end_date": req.body.end_date,
                    "country": req.body.country,
                    "network": req.body.network,
                    "status": req.body.status,
                    "image_thumbnail_path": req.body.image_thumbnail_path
                }
            }});
            res.json(findUser);
    } catch(error) {
        res.send(error);
    }
});

router.get('/details', verifyToken, async (req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })
    const findProfile = await User.findOne(
        {_id: _id}
    );
    var watchList = findProfile.WatchList;
    var result = [];

    for (let item of watchList) {
        await axios({
            "method":"GET",
            "url":"https://www.episodate.com/api/show-details?q=" + item.id,
            "headers":{
            "content-type":"application/octet-stream"
        }})
        .then((response)=>{
            result.push(response.data)
        })
        .catch((error)=>{
            result.push(error);  
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
        {"WatchList.name": req.body.name},
        {$pull: {
            "WatchList": {
                "name": req.body.name
            }
        }},
    );
    res.json(updateProfile);
});
module.exports = router;
