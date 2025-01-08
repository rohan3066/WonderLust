
require('dotenv').config();

const express=require('express');
const app=express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path =require('path');
const ExpressError=require('./utils/ExpressError.js');
const listingsRouter=require('./routes/listing.js');
const reviewsRouter=require('./routes/reviews.js');
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

app.use(express.urlencoded({extended:true}));
const method_override=require('method-override');
app.use(method_override("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const dburl=process.env.ATLASDB_URL;
mongoose.connect(dburl)
  .then(() => console.log('Connected!'));
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});

store.on("error",()=>{
  console.log("session store error");
});
const sessionOption={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.islogin=req.user;
  next();
});




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));



// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"rohanchavan3066@gmail.com",
//     username:"rohan",
//   });

//  const newUser=await User.register(fakeUser,"rohan@3066");
//  res.send(newUser);
 

// })





app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.use("*",(req,res,next)=>{
   next(new ExpressError(404,"page Not found"));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong!!"}=err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
});







app.listen(8080,()=>{
    console.log("server is running on port 8080");
})

