var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var subscribedSchema = new Schema({
	email:{type:String,unique:true},
   randid:{type:Number},
   temp:{type:Boolean,default:false}
});
module.exports = mongoose.model('subscribedUsers', subscribedSchema);