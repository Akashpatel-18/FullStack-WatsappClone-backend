const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {type: String, required: true, unique: true, lowercase: true},
    email: {type: String, required: true, unique: true},
    password: {type:String, required: true, minlength: 6},
    avatar: {
      publicUrl : {type:String},
      secureUrl : {type:String},
    },
   
},{
    timestamps: true
})

module.exports = mongoose.model('User',userSchema)