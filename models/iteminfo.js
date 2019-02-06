var mongoose = require('mongoose').set('debug',true);

var Schema = mongoose.Schema;
var itemSchema = new Schema({
    i_id : String,
    item_name : String,
    item_desc : {type:String},
    baseprice : {type:Number},
    startDate :{type:Date,default:Date.now},
    endDate:{type:Date},
    path:{type:String,required:true},
	originalname:{type:String,required:true}
},{collection:'itemdata'});
var Item = mongoose.model("Item",itemSchema);



module.exports = Item;