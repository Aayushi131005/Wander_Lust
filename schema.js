const joi=require("joi");
const Listing = require("./models/listing");
const reviews = require("./models/reviews");
module.exports.listingSchema=joi.object({
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required() ,
        price:joi.number().required().min(0),
        image:joi.string().allow("",null)

        });
       
        // module.exports.reviewSchema=joi.object({
        //         reviews:joi.object({
        //                 rating:joi.number().required(),
        //                 comment:joi.string().required(),
        //         }).required(),});