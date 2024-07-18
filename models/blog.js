const {Schema,model} = require('mongoose')
const blogSchema = new Schema({
    title:{
        type:String,
        required:true
    },author:{
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    body:{
        type:String,
        required:true
    },
    coverImageURL:{
        type:String,
        required:false
    }
},{timestamps:true})
const blog = model("blog",blogSchema)
module.exports = blog