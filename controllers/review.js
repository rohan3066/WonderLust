const Review=require('../models/review');
const Listing=require('../models/listings');

module.exports.createReview=async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review is created!");

    console.log("new review saved!!!");
    res.redirect(`/listings/${listing._id}`);
  
  };

  module.exports.deleteReview=async(req,res)=>{
    let {id,reviweId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviweId}});
    await Review.findByIdAndDelete(reviweId);
    req.flash("success","Review is Deleted!");

    res.redirect(`/listings/${id}`);
  
  };
