const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");
const ExpressError = require("../utils/expressError");
const { listingSchema } = require("../schema");
const Listing = require("../model/listing");
const isLoggesIn = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const { validate } = require("../model/reviews.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};



// Index Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync(listingController.createListing)
);


// router.route("/")
// .get(wrapAsync(listingController.index))
// .post( upload.single('listing[image]'), (req, res) =>{
//     res.send(req.body);
// });


// New Route  
router.get("/new", isLoggedIn, listingController.renderNewForm);



// Show, Update, Delete Route 
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, wrapAsync(listingController.destroyListing));



// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));


module.exports = router;





// const express = require("express");
// const router = express.Router();

// const wrapAsync = require("../utils/wrapAsync");
// const listingController = require("../controllers/listings");
// const ExpressError = require("../utils/expressError");
// const { listingSchema } = require("../schema");
// const { isLoggedIn } = require("../middleware.js");


// // Validation Middleware
// const validateListing = (req, res, next) => {

//     let { error } = listingSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details
//             .map((el) => el.message)
//             .join(",");

//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }

// };



// // INDEX ROUTE
// router.get(
//     "/",
//     wrapAsync(listingController.index)
// );



// // NEW ROUTE (must be before /:id)
// router.get(
//     "/new",
//     isLoggedIn,
//     listingController.renderNewForm
// );



// // CREATE ROUTE
// router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );



// // SHOW ROUTE
// router.get(
//     "/:id",
//     wrapAsync(listingController.showListing)
// );



// // UPDATE ROUTE
// router.put(
//     "/:id",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.updateListing)
// );



// // DELETE ROUTE
// router.delete(
//     "/:id",
//     isLoggedIn,
//     wrapAsync(listingController.destroyListing)
// );



// // EDIT ROUTE
// router.get(
//     "/:id/edit",
//     isLoggedIn,
//     wrapAsync(listingController.renderEditForm)
// );


// module.exports = router;









// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync");
// const listingController = require("../controllers/listings");
// const ExpressError = require("../utils/expressError");
// const { listingSchema } = require("../schema");
// const Listing = require("../model/listing");
// const isLoggesIn = require("../middleware.js");
// const {isLoggedIn} = require("../middleware.js");
// const listingcontroller = require("../controllers/listings.js")

// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     } else {
//         next();
//     }
// };



// router.route("/")
// .get(wrapAsync(listingController.index))
// // .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));
// .post((req, res) =>{
//     res.send(req.body);
// });

// router.route("/new")






// router.route("/:id")
// .get(wrapAsync(listingController.showListing))
// .put(isLoggedIn, validateListing, wrapAsync(listingController.updateListing))
// .delete(isLoggedIn, wrapAsync(listingController.destroyListing));


// // New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// // Edit Route
// router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// module.exports = router;







// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/expressError");
// const {listingSchema, reviewSchema } = require("../schema");
// const Listing = require("../model/listing");


// const validateListing = (req, res, next) => {
//      let {error} =  listingSchema.validate(req.body);
  
//    if(error){
//     let errMsg = error.details.map((el) =>  el. message).join(",");
//     throw new ExpressError (404, errMsg);
//    } else {
//     next();
//    }

// };



// // index Route
// router.get("/", async (req, res) => {
//    const allListings = await Listing.find({});
//    res.render("listings/index.ejs", {allListings});
//     });

// // new route

// router.get("//new", (req, res) => {
//     res.render("listings/new.ejs")
// });


// //Show Route
//     router.get("//:id", async(req, res) => {
//         let {id} = req.params;
//        const listing = await Listing.findById(id);
//        res.render("listings/show.ejs", { listing });

// });



// //Create route

// router.post("/" ,validateListing ,wrapAsync( async (req, res, next) => {
  
//    const newListing = new Listing(req.body.listing);
//    await newListing.save();
//    res.redirect("/listings");

// })
// );


// //Edit route
// router.get("//:id/edit", async(req, res) => {
//     let {id} = req.params;
//        const listing = await Listing.findById(id);
//        res.render("listings/edit.ejs", {listing})

// });

// //update route
// router.put("//:id",validateListing , async(req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     redirect("/listings");
// });


// //DELETEROUTE
// router.delete("//:id", async(req, res) => {
//     let { id } = req.params;
//    let deletedListing = await Listing.findByIdAndDelete(id);
//    console.log(deletedListing);
//    res.redirect("/listings");
// });

// module.exports = router;