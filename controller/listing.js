const Listing=require("../Models/listing");
const Review =require("../Models/reviews");
module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new");
};

module.exports.renderShowRoute=async(req,res)=>{
 const listing = await Listing.findById(req.params.id)
  .populate("owner")
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  });


if (!listing) {
  req.flash("error", "Listing not found");
  return res.redirect("/listings");
}

res.render("listings/show", { listing });

};

module.exports.renderEditForm=async(req,res)=>{
  let id=req.params.id;
  const listing=await Listing.findById(id);
  res.render("listings/edit",{listing})
};

module.exports.renderUpdateListing=async(req,res)=>{
   let id=req.params.id;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file!=="undefined"){
      const url=req.file.path;
      const filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    res.redirect(`/listings/${id}`);
};

module.exports.creatNewListing=async(req,res,next)=>{
    // let{description,price,location,country}=req.body;
     const url=req.file.path;
     const filename=req.file.filename;
      const newListing=new Listing(req.body.listing);
      newListing.owner=req.user.id;
      newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    
  };

module.exports.deleteListing=async(req,res)=>{
  let id=req.params.id;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings")
};