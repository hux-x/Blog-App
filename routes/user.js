const express = require('express')
const router = express.Router()
const {createHmac} = require('crypto')
const user = require('../models/user')
const blog = require('../models/blog')

const {createToken,validateToken} = require('../services/auth')
const { error } = require('console')
router.get('/signin',async(req,res)=>{
res.render('signin')
})

router.get('/signup',async(req,res)=>{
    res.render('signup')
    })
router.post('/signup',async(req,res)=>{
    const {fullName,email,password} = req.body
    await user.create({fullName,email,password})
    console.log(password)
 
return res.redirect('/user/signin')

})
router.get('/logout',(req,res)=>{
    res.clearCookie('uid').redirect('/')
})
router.post('/signin',async(req,res)=>{
try{
    const{password,email} = req.body
    const currentUser = await user.findOne({email})
    if(!currentUser) return res.redirect('/user/signin')
        console.log(currentUser.salt)
    const hashedPassword = createHmac("sha256",currentUser.salt).update(password).digest('hex')
    if(currentUser.password === hashedPassword){
        const token = await createToken(currentUser)
        console.log('token ',token)
        res.cookie("uid",token).redirect('/')
        
    }else{
        return res.render('signin',{error:'Invalid email or password'})
    }
    
}catch(error){
    res.render('signin',{
        error: 'Invalid email or password'
    })
}
}).get(async(req,res)=>{
    return res.render('signin')
})

router.get('/profile',async(req,res)=>{
    
    const blogs = await blog.find({createdBy:req.user._id})
    res.render('profile',{user:req.user,blogs})
  })



router.get('/settings', async(req,res)=>{
res.render('settings')
})
router.post('/settings/updatename',async(req,res)=>{
    const changeName = await user.updateOne({_id:req.user._id},{$set:{fullName:req.body.newName}})
    res.clearCookie('uid').redirect('/user/signin')
})
router.post('/settings/updateemail',async(req,res)=>{
    if(req.email !== req.body.confrimEmail) res.redirect('/user/settings')
    const changeEmail = await user.updateOne({_id:req.user._id},{$set:{email:req.body.email}})

    res.clearCookie('uid').redirect('/user/signin')
})
router.post('/settings/deleteuser',async(req,res)=>{
    const currentUser = req.user
    const toDelete = await user.findOne({email:currentUser.email})
    const{password} = req.body
    
     const hashedPassword = createHmac("sha256",toDelete.salt).update(password).digest('hex')
    
     if(toDelete.password == hashedPassword ){
        await user.deleteOne(toDelete)
        res.redirect('/user/signup')
     }else{
        res.redirect('/user/settings')

        
     }
})
router.post('/settings/updatepassword',async(req,res)=>{
    const currentUser = req.user
    const toUpdate = await user.findOne({email:currentUser.email})
    const{newPassword,confirmPassword,currentPassword} = req.body
    if(newPassword !== confirmPassword) return 
    console.log(toUpdate)
    
     const hashedPassword = createHmac("sha256",toUpdate.salt).update(currentPassword).digest('hex')
     const updatedpassword = createHmac("sha256",toUpdate.salt).update(newPassword).digest('hex')
    
     if(toUpdate.password == hashedPassword ){
        
        await user.updateOne({email:toUpdate.email},{$set:{password:updatedpassword}})
        console.log(updatedpassword)
        res.redirect('/')
     }else{
        res.redirect('/user/settings')

        
     }
})

router.get('/profile/delete/:id',async(req,res)=>{
    const User = validateToken(req.cookies['uid'])
    
    const toDelete = await blog.findById(req.params.id)
    console.log(User._id,req.params.id,toDelete._id, toDelete.createdBy)
    if(toDelete.createdBy == User._id){
        await blog.deleteOne(toDelete)
        res.redirect('/user/profile')
    }else{
        res.send('You are not Authorized to perform this action')
    }
    
    console.log(toDelete)
   
})
module.exports = router