const mongoose = require('mongoose').set('debug',true);
const Schema = mongoose.Schema;

const Item = require('./iteminfo');

const bidSchema = new Schema({
    itemSchema : [{type:mongoose.Schema.ObjectId,ref:'Item'}]
},{collection:'biddinginfo'});

const Bid = mongoose.model("Bid",bidSchema)
module.exports = Bid;