const { validateToken } = require('../services/auth');

function checkForAuthCookie(cookieName) {
    return (req, res, next) => {
        const tokenVal = req.cookies[cookieName];

        if (!tokenVal) {
            return next(); 
        }

        try {
            const userPayload = validateToken(tokenVal);
            req.user = userPayload; 
        } catch (err) {
            console.log('Error in token validation:', err.message);
          
        }

        next(); 
    };
}

module.exports = checkForAuthCookie;

// function w(req,res,next){
// const tokenval = req.cookies['uid']
// const user = validateToken(tokenval)
// if(user){
//     req.user = user
// }
// }