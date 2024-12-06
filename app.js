const mongoose=require("mongoose");
const express=require("express");
const ejsMate=require("ejs-mate");
const app=express();
const methodOverride=require("method-override");
const Listing=require("./models/listing.js");
const path=require("path");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/reviews.js");
const listings=require("./routes/listing.js");
const review=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const localStrategy=require("passport-local");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitalized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    },
    httpOnly:true,
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
main()
.then(()=>{
console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    
}

// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
    
//     if(error){
//         throw new ExpressError(400,error);
//     }else{
//         next();
//     };
// }

app.get("/",(req,res)=>{
    res.send("Hi I am root");
});
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});
// app.get("/demoUser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"anshgupta@gmail.com",
//         username:"Ansh Gupta",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })
app.use("/listings",listings);
app.use("/listings/:id/reviews",review);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message}=err;
    res.render("./listings/error.ejs",{message});
   
    
})
app.listen(8080,()=>
{
    console.log("Listening to server");
});
