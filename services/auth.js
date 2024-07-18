const jwt = require('jsonwebtoken')
const KEY = "kfjie@904@%;ak9@$9klajdf"
const createToken = async (user)=>{
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role:user.role
    }
    const token = jwt.sign(payload,KEY)
    return token
}
const validateToken = (token)=>{
    return jwt.verify(token,KEY)
}
module.exports = {createToken,validateToken}