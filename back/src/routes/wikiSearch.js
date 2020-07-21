const express = require('express');
const router = express.Router();
const passwordHash = require("password-hash");
var ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');
// const Favorite = require('../models/users');

const jwt = require('jsonwebtoken');
const axios = require('axios');

var verifyToken = require('../auth/auth');


router.get('/search', async (req, res) => {

    var key;
   await axios({
        "method":"GET",
        "url": "https://random-word-api.herokuapp.com/word?number=1"
    }).then((response)=>{
        console.log(response.data)
       key = response.data
    })
    .catch((error)=>{
        res.json(error)    
    })
  
    try {
        axios({
        "method":"GET",
        "url": "http://fr.wikipedia.org/w/api.php?action=opensearch&search=" + key
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


router.get('/search/:key', async (req, res) => {
    try {
        axios({
        "method":"GET",
        "url": "http://fr.wikipedia.org/w/api.php?action=opensearch&search=" + req.params.key
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

router.post('/addArticle', verifyToken, async(req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    });
    const addArticle  = await User.updateMany(
        {"_id" : _id},
        {$push: {
            "wikiList" : {
                "name" : req.body.name,
                "url" : req.body.url
            }
        }}
    );
    res.json(addArticle);
});


module.exports = router;
