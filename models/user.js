const mongoose = require("mongoose")
const {createHmac,randomBytes} = require('node:crypto')
const userSchema = mongoose.Schema({
   
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    profileImageURL:{
        type:String,
        required:true,
        default:"/images/default.jpg"
    },
    role:{
        type:String,
        enum: ["USER","ADMIN"],
        default:"USER",
        required:true
    }
},{timestamps:true})
userSchema.pre('save',async function(next){
    const user = this;
    if(!user.isModified('password')) return
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest('hex')
    this.salt = salt 
    this.password = hashedPassword



})
const user = mongoose.model("user",userSchema)

module.exports = user