const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review = require('../Models/reviews.js');
const Listing = require('../Models/listing.js');
const {validateReview,isLoggedIn}=require("../middleware.js");


//------------------Reviews---POst route

router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
   let listing=await Listing.findById(req.params.id);
   
   if (!listing) {
  throw new ExpressError(404, "Listing not found");
    }

   let newReview=new Review(req.body.review);
   newReview.author=req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
  console.log("new reviews saved");
  res.redirect(`/listings/${listing._id}`);
}))

//--------------DELETING REVIEWS-----------------

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId}=req.params;

  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));

module.exports=router;
