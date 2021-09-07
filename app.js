const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const bodyParser = require('body-parser')
const {ensureAuthenticated} = require('./config/auth');
const app = express();
app.use(express.static(__dirname + '/views'));
//Passport config
require('./config/passport')(passport);
//DB config
const db=require('./config/keys').MongoURI;
//Connect to Mongo
mongoose.connect(db,{ useNewUrlParser:true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))
//EJS
app.use(expressLayouts)
app.set('view engine','ejs')
//Bodyparser
app.use(express.urlencoded({ extended:false }))
app.use(bodyParser.urlencoded({extended:true}))
// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());
//Global Vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})
var i=""
//Routes
app.use('/users', require('./routes/users'))
const itemSchema ={
  name:{
    type: String,
    required: true,
    trim:true
  },
  username:String,
  date:{
      type: Date,
      default: Date.now
  },
  deadline:{
    type: Date
  }
}
const Item = mongoose.model('Item',itemSchema);
app.get('/',(req, res) => res.render('welcome'));
app.get('/dashboard',ensureAuthenticated,(req,res) =>{
  Item.find({"username":req.user.name},(err,f)=>{
      res.render('dashboard',{newListItems:f, na:req.user.name});
  })
})
app.post('/dashboard',(req,res) =>{
   i=req.body.n;
   const ia=req.body.na;
  const item = new Item({
      name:i,
      username:req.user.name,
      deadline:ia
  })
  item.save()
  res.redirect('/dashboard')
})
app.post('/delete',(req,res) => {
  const check = req.body.trash
  Item.findByIdAndRemove(check,(err) => {
      if(!err) console.log("Successfully deleted")
      res.redirect('/dashboard')
  })
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
