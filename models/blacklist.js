const mongoose = require('mongoose');

const blacklistSchema=new mongoose.Schema({
    mail:{type:String, unique:true}
})

module.exports=mongoose.model("blacklist",blacklistSchema);