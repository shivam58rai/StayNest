const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema({
    // we only making email here bcz passportlocalmongoose make username and password himaself
    email:{
        type:String,
        required:true
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);