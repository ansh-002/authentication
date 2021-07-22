const {Router} = require('express');
const router =  Router();
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    let errors  = {email:'',password:''};
    //incorrect email
    if(err.message === 'incorrect email')
     {
         errors.email = "That email is not registered";
     }
     //incorrect password
     if(err.message === 'incorrect password')
     {
         errors.email = "That password is incorrect";
     }
    // duplicate error code
    if(err.code === 11000)
    {
        errors.email = "that email is already registered";
        return errors;
    }
     // validation errors
     if(err.message.includes('user validation failed'))
     {
         Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
         });
     }
     return errors;
}
const maxAge = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},'this is my secret',{
        expiresIn:maxAge
    });
}

router.get('/signup',(req,res)=>{
      
    if(res.locals.user)
     res.redirect('/home');
    res.render('signup');
});
router.post('/signup',async(req,res)=>{
   const {email,password} = req.body;
   console.log(req.body);
   try{
      const user =  new User({email,password});
      const user1 = await user.save();
      const token = createToken(user1._id);
      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
      res.redirect('/home');
   }
   catch(e)
   {
       const errors = handleErrors(e);
       res.status(400).render('errors',{errors});
   }
});
router.get('/login',(req,res)=>{
    
    if(res.locals.user)
     res.redirect('/home');
    
  res.render('login');
});
router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    console.log(req.body);
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.redirect('/home');
    }
    catch(e)
    {
        const errors = handleErrors(e);
        res.status(400).render('errors',{errors});
    }
});
router.get('/logout',(req,res)=>{
   res.cookie('jwt','',{maxAge:1});
   res.redirect('home');
});
module.exports = router;