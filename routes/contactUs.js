const express = require('express');
const router = express.Router();

const Feedback = require('../models/feedback');

router.get('/contact',function(req,res){
    res.render('contactUs');
})

module.exports = router;