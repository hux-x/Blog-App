const express = require('express')
const router = express.Router()
const {createHmac} = require('crypto')
const user = require('../models/user')
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
module.exports = router