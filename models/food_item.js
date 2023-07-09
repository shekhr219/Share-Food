const mongoose= require('mongoose');
const Schema=mongoose.Schema;
const food_itemsSchema= new Schema({
    foodName:{
       type:String,
       required:true
    },
    quantity:{
        type:String,
        required:true
     },
     address:{
        type:String,
        required:true
     },
     phone:{
        type:String,
        required:true
     },
     waitTime:{
        type:String,
        required:true
     },
     description:{ 
        type:String,
     },
     createdAt:{
        type:Date,
        default:Date.now
      },
     updatedAt:{
        type:String,
        default:Date.now
     },
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
     status:{
       type: String,
       default:'other',
       enum:['other','mine']
     }
});
module.exports=mongoose.model('food_items',food_itemsSchema);