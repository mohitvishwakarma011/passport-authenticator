const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//passport config
require('./config/passport')(passport);

const app = express();

// DB COnfig
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db).then(()=>console.log("Mongo DB Connected yuhooo!")).catch(err=> console.log("Something went wrong on server side ",err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended:false}));

//express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//PAssport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash 
app.use(flash());

//Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes
app.use('/',require('./routes/index')); 
app.use('/users',require('./routes/users'));
app.use('/dashboard',require('./routes/dashboard'));

const PORT = process.env.PORT||5000;

app.listen(PORT,console.log(`Server is started at port ${PORT}`));