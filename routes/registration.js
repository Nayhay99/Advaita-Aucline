const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const bcrypt = require('bcryptjs')

const User = require('../models/userinfo');

//main page 
router.get('/',function(req,res){
    res.render('registration');
});
// signup 
router.get('/signup',function(req,res){
    res.render('signup',{
		user:req.user
	});
});
router.get('/signin',function(req,res){
	res.render('signin',{
		user:req.user
	});
})
router.get('/forgot',function(req,res){
	res.render('forgot',{
		user:req.user
	});
});
router.get('/reset',function(req,res){
	res.render('reset',{
		user:req.user
	});
})
// see to this!?**********************
router.get('/logout',function(req,res){
	console.log('are u?');
	req.logout();
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/signup',function(req,res){
    var type = req.body.type;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var email = req.body.email;
    var phone = req.body.phone;
	var country = req.body.country;
	
	console.log('here');
    // Validation
    // req.checkBody('type','Type is required').notEmpty();
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('phone','Contact Detail is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    console.log('validating');
	var errors = req.validationErrors();
	console.log("checking errors");
	if (errors) {
		res.render('signin', {
			errors: errors
        });
        console.log('can u send me?');
        res.send("error! maybe you used username or email");
        console.log('what about me?');
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('signup', {
						user: user,
						mail: mail
					});
				}
				else {
					console.log("checked errors!");
					var newUser = new User({
                        type:type,
                        name: name,
                        username: username,
                        password: password,
                        email: email,
                        phone:phone, 
						country:country
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
					});
         			req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/signin');
				}
			});
		});
	}
});

// add sessions
router.post('/signin', passport.authenticate('local', { successRedirect: '/homepage', failureRedirect: '/signin', failureFlash: true }),function (req, res) {
	res.redirect('/signin');
});

router.post('/forgot',function(req,res){
    var email = req.body.email;
    User.findOne({email:email},function(err,user){
        if(err) return console.log(err)
            var transporter = nodemailer.createTransport({
                service : 'gmail',
                auth : {
                		user : 'aucline@gmail.com',
                		pass : 'webdchallenge'
                }
            });
            var mailOptions = {
                to: email,
                from : 'aucline@gmail.com',
                subject : 'Aucline Password Reset',
                text : 'You are recieving this because you have requested the reset of your password for the account. \n\n' + 
                'Please click on the following link, or paste this into your browser to complete the prpcess:\n\n' +
                 'http://' + req.headers.host + '/reset' + '\n\n' +
                'If you did not request this, someone else may have tried to access your account, report to the admin! \n'
            };
            transporter.sendMail(mailOptions, function(err,info){
                if(err) return console.log(err)
            });
    });
    res.redirect('https://www.gmail.com');
});
router.post('/reset',function(req,res){
    var email= req.body.email;
	var password= req.body.password;
    User.findOneAndUpdate({email:email},{password:password},function(err,user){
		if (err) return console.log(err)
	});
    res.redirect('/signin');
});

module.exports = router;