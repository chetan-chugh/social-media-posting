const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type:String, require:true, unique:true},
    email:{type:String, require:true, unique:true},
    password:{type:String, require:true},
    posts:[
        {type: mongoose.Schema.Types.ObjectId, ref:'Post'}
    ],
    accesstoken:{type:String}
});

module.exports = mongoose.model("User",userSchema);