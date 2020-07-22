const express = require('express');
const router = express.Router();
const passwordHash = require("password-hash");
var ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');
// const Favorite = require('../models/users');

const jwt = require('jsonwebtoken')
const axios = require('axios')

var verifyToken = require('../auth/auth')

router.get('/', async (req, res) => {
    try {
        const profiles = await User.find();
        res.json(profiles);
    }
    catch(err) {
        res.json({message: "no user found"});
    };
});

router.patch('/', verifyToken, async (req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })

    try {
        const updateProfile = await User.updateOne(
            {_id: _id},
            {$set: {
                email: req.body.email
            }}
        );
        res.json(updateProfile);
    }
        catch(err) {
            res.json({message: "profile can't be updated"});

    };
});

router.get('/info', verifyToken, async(req, res) => {
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })
    const findUser = await User.findOne({_id: _id});
    res.json(findUser)
});

router.delete('/', async(req, res) => {
    try {
        const removedProfile = await User.remove({_id: "5f05bba376e83110c8ccf268"});
        res.json(removedProfile);
    } catch(err) {
        res.json({message: "profile can't be deleted"});

    };
})

router.post('/', async (req, res) => {
    console.log(req.body)
    const user  = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
    });
    try{
        const savedProfile = await user.save();
        console.log("user created")
        jwt.sign({user}, 'secretkey', (err, token) => {
            res.json({
                    token
            })
        })
    } catch(err) {
        res.json({message: "user can't be created"})
    };
});
        
router.post('/login', async (req, res) => {

    const { password, email } = req.body;
    
    if (!email) {
        res.status(400).json({
            text: "Invalid request"
        });
    }
    try {
        const findUser = await User.findOne({ email });
            jwt.sign({findUser}, 'secretkey', (err, token) => {
                res.json({
                        token
                })
            })
    } catch(err) {
                res.status(400).json({message: "can't connect to this account 3"});
    };
});

router.post('/posts', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created ...',
                authData
            })
        }
    })
});
module.exports = router;
