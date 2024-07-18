const express = require('express')
const router = express.Router()
const blog = require('../models/blog')
router.get('/addblog',(req,res)=>{
    res.render('addBlog',{user:res.user})
})
router.post('/addBlog', async(req,res)=>{
    const {title,body,author,coverImageURL} = req.body
   const newBlog = await blog.create({title,body,author,coverImageURL})
   console.log(newBlog)
   res.redirect('/')


})
module.exports = router