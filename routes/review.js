const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams - id milega
const Listing = require("../model/listing");
const Review = require("../model/reviews.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { reviewSchema } = require("../schema");


//  validateReview yahan define karo
const validateReview = (req, res, next) => {
    
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

const reviewsController = require("../controllers/reviews.js");

// Post review
router.post("/", validateReview, wrapAsync(reviewsController.createReviews));

// Delete review
router.delete("/:reviewId", wrapAsync(reviewsController.destroyReview));

module.exports = router; //  router, not routers()




// const express = require("express");
// const Listing = require("../model/listing");
// const router = express.Router();



// // //reviews
// // //post route
// router.post("/",validateReview, wrapAsync(async(req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("new review saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// router.delete("/:reviewId", wrapAsync(async(req, res) => {
//    let { id, reviewId } = req.params;

//    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId } });

//    res.redirect(`/listings/${id}`)
// }));

// module.exports = routers();