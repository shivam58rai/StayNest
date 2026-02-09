require("dotenv").config();
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const port=8080;
const ExpressError=require("./utils/ExpressError.js");
const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const session =require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views") );
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/StayNest');
}

app.get("/",(req,res)=>{
    res.send("this is working");
})

//session and flash --------------------------
app.use(session({
  secret:"mysecretscode",
  resave:false,
  saveUninitialized:false
}))

app.use(flash());

// passport for authentication------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})
// middleware for routes--------------------
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  let {status = 500, message = "Something went wrong"} = err;
  res.status(status).render("Error.ejs",{err});
});

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});



