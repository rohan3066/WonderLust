const Listing=require('./models/listings');
const Review=require('./models/review');
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){

        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create a new listing");
        res.redirect("/login")
      }
      else{
        next();
    }



}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }

    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(res.locals.islogin &&!listing.owner._id.equals(res.locals.islogin._id)){
     req.flash("error","You Don't have permission");
     res.redirect(`/listings/${id}`);
 
    }

    next();
};

module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviweId}=req.params;
    let review1=await Review.findById(reviweId);

    if(!review1.author.equals(res.locals.islogin._id)){
        req.flash("error","You Don't have permission");
        return res.redirect(`/listings/${id}`);
    };
    next();

}

