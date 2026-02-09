const express=require("express");
const router=express.Router();
const Listing = require('../Models/listing.js');
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const { renderNewForm, renderShowRoute, renderEditForm, renderUpdateListing, creatNewListing, deleteListing } = require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});



//------HOME route
router.get("/",wrapAsync(async(req,res)=>{
  
 const allListings= await Listing.find({})
 res.render("listings/index",{allListings});
 
}))

// ----------new route
router.get("/new",isLoggedIn,renderNewForm);


router.route("/:id")
  .get(wrapAsync(renderShowRoute))
  .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(renderUpdateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(deleteListing))


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(renderEditForm));

router.post("/", isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(creatNewListing));






module.exports=router;