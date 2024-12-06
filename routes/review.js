const express=require("express");
const router=express.Router({mergeParams:true});
const methodOverride=require("method-override");
const Listing=require("../models/listing.js");
const path=require("path");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/reviews.js");
const listings=require("./listing.js");
const review=require("./review.js");


router.post("/", async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    
    let info={
        comment:req.body.comment,
        rating:req.body.rating,
        
    }
    let newReview =new Review(info);
    listing.reviews.push(newReview);
    await newReview.save();
    
    await listing.save();

    req.flash("success","New Review Created!");
    console.log("New Review saved");
    //res.send("new review saved");
    res.redirect(`/listings/${id}`);

});
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);

}));
module.exports=router;
