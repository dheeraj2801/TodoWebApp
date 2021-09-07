const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const validator = require('validator')
const nodemailer = require('nodemailer')

const User = require('../models/User');

router.use(express.static(__dirname + '/views'));


// route for when user views login page
router.get('/login',(req,res) => {
    if(req.isAuthenticated()){
        res.redirect('../')
    }
    else{
        res.render('login', {message: undefined})
    }
})

// route for when user views register page
router.get('/register',(req,res) => {
    if(req.isAuthenticated()){
        res.redirect('../')
    }
    else{
        res.render('register',{message: undefined})
    }
})

// route for when user submits register details
router.post('/register',(req,res) => {
    const {name,email,password,password2} = req.body;
    let errors=[];

    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'})
    }

    //Check password match
    if(password!==password2){
        errors.push({msg:'Password do not match'})
        //Password does not contain "password"
            if (password.toLowerCase().includes('password')) {
                errors.push({msg:'Password cannot contain "password"'})
            }
    }

    //Check pass length
    if(password.length<6){
        errors.push({msg:'Password should be at least 6 characters'})
    }
    //Check the email structure
        if (!validator.isEmail(email)) {
                errors.push({msg:'Email is invalid'})
    }
    //Check if the Username is already existed or not
    User.findOne({name:name})
    .then(user => {
        if(user){
            errors.push({msg:'Username already exists'})
        }
    }) 

    if(errors.length>0){
        res.render('register',{
            errors,
            name, email, password, password2
        });
    } else{
        //Validation passed
        User.findOne({email: email})
        .then(user =>{
            if(user){
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
            name, email, password, password2
                });
            } else{
                const newUser = new User({
                    name,
                    email,
                    password,
                });
                //Hash password
                bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.password, salt,(err,hash) =>{
                    if(err) throw err;
                    //Set password to hashed
                    newUser.password=hash;
                    //Save user
                    newUser.save()
                    .then(user =>{
                        req.flash('success_msg','You are now registered and can log in');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err))
                }))
            }
        })
    }
});


//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

// route for when user logs out, session is destroyed and user redirected to login
router.get('/logout',(req, res) => {
    // const na=req.user.name;
    // const em=req.user.email;
  //   const output=`<h3> Your pending Tasks: </h3> <br> 

  //    <p>The right productivity method can make a huge difference in the way you work.<br> Vision without Action is a day dream and Action without Vision is a night dream</p> `
     
  // var transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //       user:'dheeruungarala@gmail.com',
  //       pass:'Ung28012001'
  //   }
  // });
  // var mailOptions = {
  //   from:'dheeruungarala@gmail.com',
  //   to:em,
  //   subject:`${na}'s task(s)`,
  //   html:output
  // };
  // transporter.sendMail(mailOptions, (err,info) => {
  //   if(err)
  //       console.log(err);
  //   else
  //       console.log('Email sent: '+ info.response)
  // });


    req.logout()
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports = router;