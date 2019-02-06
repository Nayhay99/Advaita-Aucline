var mongoose = require('mongoose').set('debug',true);

var Schema = mongoose.Schema;

var imageSchema = new Schema({
    im_id : String,
    path : {type:String,required:true},
    originalname : String
},{collection:'imagedata'});
var Image = module.exports = mongoose.model("Image",imageSchema);