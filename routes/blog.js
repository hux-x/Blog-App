const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const blog = require('../models/blog')
const path = require('path')
router.get('/addblog',(req,res)=>{
    res.render('addBlog',{user:res.user})
})
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
const upload = multer({ storage: storage })
router.post('/addBlog',upload.single('coverImage'), async(req,res)=>{
    const {title,body,author} = req.body
    console.log(req.file)
    console.log(req.body)
   const newBlog = await blog.create({title,body:`${body}`,author,coverImageURL:`/uploads/${req.file.filename}`,createdBy:req.user._id})
   console.log(newBlog)
   res.redirect('/')
})
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid blog ID');
  }

  try {
    const requestedBlog = await blog.findById(id);
    if (!requestedBlog) {
      return res.status(404).send('Blog post not found');
    }
    res.render('blog', { blog: requestedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching blog post');
  }
});


module.exports = router