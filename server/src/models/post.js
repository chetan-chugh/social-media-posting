const mongoose = require('mongoose');
// const User = require('./User');

const postSchema = new mongoose.Schema({
    text:{type:String},
    user:{ type:mongoose.Schema.Types.ObjectId , ref:"User"},
    likes:[{type:mongoose.Schema.Types.ObjectId , ref:"User"}]
},{timestamps:true});

module.exports = mongoose.model("Post",postSchema);