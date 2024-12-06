const express=require("express");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const methodOverride=require("method-override");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    };
}
router.get("/",wrapAsync(async(req,res)=>{
    const all_list=await Listing.find({});
     res.render("./listings/index.ejs",{all_list});
  
 
 
     })
 );
 router.get("/new",(req,res)=>{
    res.render("./listings/Create_New.ejs");
});
router.put("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{
        description:req.body.description,
        image:req.body.image,
        price:req.body.price,
        location:req.body.location,
        country:req.body.country});
        req.flash("success","Listing Updated!");
        res.redirect("/listings");
}));
router.get("/:id",async(req,res)=>{
    let {id}=req.params;
    let info=await Listing.findById(id).populate("reviews");
    if(!info){
        req.flash("error","Listing you requested for does not exist!");    
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{info})

});
router.delete("/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","New Listing Deleted!");
    res.redirect("/listings");
});
router.get("/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let info=await Listing.findById(id);
    res.render("./listings/Edit_form.ejs",{info});

});
router.post("/",wrapAsync(async(req,res,next)=>{
    const {title,description,image,price,location,country}=req.body;
     const new_list=new Listing({
         title:title,
         description:description,
         image:image,
         price:price,
         location:location,
         country:country,
     });
 
    
     await new_list.save();
     req.flash("success","New Listing Created!");
     res.redirect("/listings");
     
     
 }));
module.exports=router;