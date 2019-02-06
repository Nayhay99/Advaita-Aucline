const express = require('express');
const router = express.Router();
const multer = require('multer');

// userdata
const Item = require('../models/iteminfo');
const User = require('../models/userinfo');

router.get('/newauc',function(req,res){
    res.render('newauc',{
        user:req.user
    });
});

//storage engine
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/uploads/')
    },
    filename : function(req,file,cb){
        cb(null,file.originalname);
    }
});

//upload init
var upload = multer({
    storage:storage
});

// GET GET GET
router.get('/liveauc',function(req,res){
    User.find({},function(err,user){
        Item.find({},function(err,data){
            res.render('homepage',{
                user:user,
                data:data
            })
        });
        console.log('reached here!!?');
    });
});
router.post('/newauc',upload.single('file'),function(req,res){
    var Auction = new Item({
        i_id : req.user._id,
        item_name : req.body.item_name,
        baseprice : req.body.baseprice,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        item_desc : req.body.item_desc,
        path: req.file.path,
        originalname:req.file.originalname
    });
    Auction.save(function(err,data){
        if(err) console.log(err);
          console.log("saved");
    });
    res.redirect('/homepage#auc_stat');
});

router.get('/',function(req,res){
    User.find({},function(err,udata){
        Item.find({},function(err,data){
            if(err) console.log(err);
                res.render('homepage',{
                    user:req.user,
                    data:data,
                });
        });
    });
});

router.get('/profile',function(req,res){
    var count = 0;
    User.find({},function(err,user){
        Item.find({},function(err,data){
            for(var z=0;z<data.length;z++){
                if(req.user._id == data[z].i_id){
                    count++;
                }
            }
            res.render('profile',{                
                user:req.user,
                data:data,
                count:count
            });
        })
    })
});


module.exports = router;