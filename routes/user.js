const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const User=require("../Models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

router.get("/signUp",(req,res)=>{
     res.render("users/signUp");
})

router.post("/signUp",wrapAsync(async(req,res)=>{
    try{
        const {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","welcome to StayNest");
        res.redirect("/listings"); 
    })
   
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
   
}))

router.get("/login",(req,res)=>{
    res.render("users/login");
})

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),(req,res)=>{
  const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl; // cleanup
    res.redirect(redirectUrl);
})
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logout successfull");
        res.redirect("/listings");
    });
});
module.exports=router;