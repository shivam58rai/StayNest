const Listing=require("./Models/listing");
const Review=require("./Models/reviews");
const ExpressError=require("./utils/ExpressError.js");
const {ListingSchema, reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
   if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {

     req.flash("error", "you are not the owner of the listing");
     return res.redirect(`/listings/${id}`);
   }
  next();
}

// handling serverside validation error using joi
module.exports.validateListing =(req,res,next)=>{
  let{error}=ListingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400, error.details[0].message);
  }else{
    next();
  }
};

// handling serverside validation error using joi for reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details[0].message;
    throw new ExpressError(400, msg);
  }
  next();
};
