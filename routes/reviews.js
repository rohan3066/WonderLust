const express=require('express');
const router=express.Router({mergeParams:true});
const Listing = require('../models/listings');
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {isLoggedIn, isAuthor}=require('../middleware.js');
const reviewController=require('../controllers/review.js');


const validatingReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
  
    if(error){
      let errMsg=error.details.map((ele)=>ele.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
  }

  //create review
  router.post("/",isLoggedIn,validatingReview,wrapAsync(reviewController.createReview));


  //delete review
  
  router.delete("/:reviweId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

  module.exports=router;
  