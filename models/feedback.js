var mongoose = require('mongoose').set('debug',true);
var Schema = mongoose.Schema;

var fbSchema = new Schema({
	fname:String,
	femail:String,
	subject:String,
	message:String
},{collection:'feedbackdata'});
var Feedback = module.exports = mongoose.model("Feedback",fbSchema);