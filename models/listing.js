const mongoose=require("mongoose");
const Review=require("./reviews.js");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
   title:{
    type:String,
    required:true,
   },
   description: String,
   price:Number,

   image:{
    type:String,
    set:(v)=>v===""? "https://unsplash.com/photos/a-tall-rock-sticking-out-of-the-side-of-a-hill-9IX5BZWS2lg":v,
   },
   location:String,
   country:String,
   reviews:[
      {
         type:Schema.Types.ObjectId,
         ref:"Review",
      },
   ]

});
listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
      await Review.deleteMany({_id:{$in:listing.reviews}});
   }
   
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;