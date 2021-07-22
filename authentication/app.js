const express =  require('express');
const app =  express();
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser} = require('./middleware/authMiddleware.js');
mongoose.connect('mongodb://localhost/userdb', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("connected to mongo db");
})
.catch((err)=>{
    console.log("unable to connect");
})


app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
const router = require('./auth.js');
app.get('*',checkUser);
app.get('/home',(req,res)=>{
   res.render('home');
});
app.get('/special',requireAuth,(req,res)=> res.render('special'));
app.use(router);
app.listen(3000,()=>{
    console.log("listening at port 3000");
});





