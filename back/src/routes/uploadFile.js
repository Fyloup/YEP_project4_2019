const passwordHash = require("password-hash");
var ObjectId = require('mongodb').ObjectID;
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const axios = require('axios');

var verifyToken = require('../auth/auth');
const express = require('express');
const router = express.Router();
var multer  = require('multer');

const multerConf = {
    storage : multer.diskStorage({
        destination : function(req, file, next) {
            next(null, './uploads');
        }, 
        filename : function(req, file , next) {
            const ext = file.mimetype.split('/')[1];
            next(null, file.fieldname+ '-' + Date.now()+'.'+ ext);
        },
        fileFilter : function (req, file, next) {
            if (!file) {
                next();
            }
            const image = file.mimetype.startsWith('image/');
            if (image) {
                next (null,true);
            } else {
                next({message: "File type not supported"}, false)
            }
        }
    })
}
  router.post('/file', verifyToken, multer(multerConf).single('photo'), async function(req, res) {
    // res.send("c'est bon");
    var _id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
               _id =  authData.findUser._id
        }
    })

      if(req.file) {
        console.log(req.files);
    }
    const findUser = await User.updateOne({_id: _id},
        {$push: {
        "videoList" : {
            "title" : req.body.title,
            "path" : req.file.filename,
            "description" : req.body.description,
        }
    }});
    res.send(findUser)
    // const upload = new uploadSchema(req.body).save();
    // res.redirect('back');
  });


module.exports = router;
