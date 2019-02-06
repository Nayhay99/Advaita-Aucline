const mongoose = require('mongoose').set('debug',true);
const bcrypt = require('bcryptjs');

const Item = require('./iteminfo');

const Schema = mongoose.Schema;
const userSchema = new Schema({
	type:{type:String,required:true},
    name:{type:String,required:true},
    username : {type:String,required:true, unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:Number,required:true},
	country:{type:String,required:true},
	itemSchema : [{type:mongoose.Schema.ObjectId,ref:'Item'}]
},{collection:'userdata'});
const User = mongoose.model("User",userSchema);

User.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

User.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

User.getUserById = function(id, callback){
	User.findById(id, callback);
}

User.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports = User;