const express = require('express');
const router = express.Router();
const passwordHash = require("password-hash");
var ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');
// const Favorite = require('../models/users');

const jwt = require('jsonwebtoken');
const axios = require('axios');

var verifyToken = require('../auth/auth');


router.get('/search/:q', async (req, res) => {

    console.log(req.params.q)
    try {
        axios({
        "method":"GET",
        "url": "https://www.googleapis.com/youtube/v3/search?key=AIzaSyDqNK0dwauUD1m_arBRlBB_hz5kDBb0i6Q&q=" + req.params.q + "&part=snippet"
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


router.post('/addYoutubeCategory', verifyToken, async (req, res) => {
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
                "youtubeSearch" : {
                    name : req.body.category 
                }
            }});
            res.json(findUser);
    } catch(error) {
        res.send(error);
    }
});


router.get('/forMe',verifyToken, async (req, res) => {
    var youtubeSearch = [];
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
    youtubeSearch = updateProfile.youtubeSearch

   
    for (let item of youtubeSearch) {
        await  axios({
            "method":"GET",
            "url": "https://www.googleapis.com/youtube/v3/search?key=AIzaSyDqNK0dwauUD1m_arBRlBB_hz5kDBb0i6Q&q=" + item+ "&part=snippet&maxResults=1"
        })
        .then((response)=>{
            result.push(response.data.items)
        })
        .catch((error)=>{
            result.push(error)    
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
        {"youtubeSearch.name": req.body.name},
        {$pull: {
            "youtubeSearch": {
                "name": req.body.name
            }
        }},
    );
    res.json(updateProfile);
});

module.exports = router;
