const Listing=require('../models/listings');

module.exports.index=async(req,res)=>{
    const allistings= await Listing.find({});
    res.render("listings/index.ejs",{allistings});
 };


 module.exports.newListing=(req,res)=>{
    res.render("listings/new.ejs");
  };

  module.exports.showListing=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
     req.flash("erorr","Listing you are requested for does not exit!");
     res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
  };

  module.exports.addListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.image={url,filename};
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing is created!");
    res.redirect("/listings");
    console.log(newListing);

};

module.exports.editListing=async(req,res,next)=>{
   let {id}=req.params;
   let editListing=await Listing.findById(id);
   let originalImageUrl=editListing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
   editListing.image.url=originalImageUrl;
   console.log(originalImageUrl);

   res.render("listings/edit.ejs",{editListing});
 
 };

 module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params;

    let updatedListing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    let url=req.file.path;
    let filename=req.file.filename;
    updatedListing.image={url,filename};
    await updatedListing.save();
    req.flash("success","listing is Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted");
    res.redirect("/listings");
  };