const express = require('express')
const router = express.Router()
const {createHmac} = require('crypto')
const user = require('../models/user')
router.get('/signin',async(req,res)=>{
res.render('signin')
})
router.get('/signup',async(req,res)=>{
    res.render('signup')
    })
router.post('/signup',async(req,res)=>{
    const {fullName,email,password} = req.body
    console.log(password)
   await user.create({fullName,email,password})
   return res.redirect('/')
})
router.post('/signin',async(req,res)=>{
    const{password,email} = req.body
    const currentUser = await user.findOne({email})
    if(!currentUser) return res.redirect('/signin')
        console.log(currentUser.salt)
    const hashedPassword = createHmac("sha256",currentUser.salt).update(password).digest('hex')
    if(currentUser.password === hashedPassword){
        res.redirect('/')
    }else{
        return res.redirect('/signin')
    }
}).get(async(req,res)=>{
    return res.render('signin')
})
module.exports = router