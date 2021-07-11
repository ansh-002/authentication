const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    //check json web token exists & is verified
    if(token)
    {
        jwt.verify(token,"this is my secret",(err,decodedToken)=>{
            if(err)
             res.redirect('/login');
            else
            {
                next();
            }
        })
    }
    else
    {
        res.redirect('/login');
    }
}

// check current user
const checkUser = (req,res,next) => {
   
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,"this is my secret",async(err,decodedToken)=>{
            if(err)
            {
                res.locals.user = null;
                next();
            }
            else
            {
                let user1 = await User.findById(decodedToken.id);
                res.locals.user = user1;
                next();
            }
        })
    }
    else
    {
        res.locals.user = null;
        next();
    }
}
module.exports = {requireAuth,checkUser};