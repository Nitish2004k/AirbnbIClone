require('dotenv').config();
// Purana - ye hatao
// if (process.env.NODE_ENV != "production") {
//     require('dotenv').config();
// }

// Naya - ye lagao (sabse upar)

// if (process.env.NODE_ENV != "production") {
//     require('dotenv').config();
// }

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/expressError");
const { reviewSchema } = require("./schema");
const Review = require("./model/reviews.js");
const Listing = require("./model/listing");
const User = require('./model/user');

const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require("passport");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require('./routes/user.js');

// ✅ Fix 1: use dbUrl (not bare ATLASDB_URL) inside mongoose.connect
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl); // ✅ was: mongoose.connect(ATLASDB_URL) — ReferenceError
}

main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

// App config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});


store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

// ✅ Fix 2: session secret moved to env variable (never hardcode secrets)
const sessionOptions = {
    store,
    secret: process.env.SECRET || 'fallback_dev_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Locals middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/", user);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// ✅ Fix 3: removed duplicate POST /listings/:id/reviews here
// This route belongs in routes/review.js only — having it in both
// caused double-save bugs. Keep it only in your reviews router.



// Review validator
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);   // ✅ message pehle, statusCode baad mein
    } else {
        next();
    }
};

// 404 handler for unmatched routes
app.all("/{*any}", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));   // ✅ message pehle, statusCode baad mein
});

// Global error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});




// // Review validator (export this to schema.js or middleware if reused)
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg); // ✅ Fix 4: was 404, should be 400 for validation
//     } else {
//         next();
//     }
// };

// // ✅ Fix 5: 404 handler for unmatched routes (use named wildcard for Express v5 / path-to-regexp v8+)
// app.all("/{*any}", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// // Global error handler
// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).render("error.ejs", { err });
// });

// app.listen(8080, () => {
//     console.log("Server is listening on port 8080");
// });



// if  (process.env.NODE_ENV != "production") {
//     require('dotenv').config();

// }

// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync");
// const ExpressError = require("./utils/expressError");
// const { reviewSchema } = require("./schema");
// const Review = require("./model/reviews.js");
// const Listing = require("./model/listing");
// const User = require('./model/user');

// const session = require('express-session');
// const flash = require('connect-flash');
// const LocalStrategy = require('passport-local');


// const passport = require("passport");

// const listings = require("./routes/listing.js");
// const reviews = require("./routes/review.js");
// const user = require('./routes/user.js');

// // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL;

// main().then(() => {
//     console.log("connected to DB");
// }).catch((err) => {
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect(ATLASDB_URL);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

// const sessionOptions = {
//     secret: 'your_secret_key_here',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // ✅ Fix 2: wrap in new Date()
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true
//     }
// };



// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");        // ✅ Fix 3: added error flash locals
//     res.locals.currUser = req.user;               // ✅ Fix 4: expose logged-in user to all views
//     next();
// });

// // ✅ Fix 5: removed duplicate review route registration (was registered twice at top)
// // ✅ Correct order — specific routes first, parameterized routes last
// app.use("/", user);                        // /signup, /login  ← FIRST
// app.use("/listings", listings);            // /listings        ← SECOND  
// app.use("/listings/:id/reviews", reviews); // /listings/:id   ← LAST
// // Review validate
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     } else {
//         next();
//     }
// };

// // ✅ Fix 6: this route is likely already in reviews router — can be removed from here
// // Keeping it only if it's NOT in routes/review.js
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     console.log("new review saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// // Error handler
// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).render("error.ejs", { err });  // ✅ Fix 7: removed redundant err mutation
// });

// app.listen(8080, () => {
//     console.log("Server is listening on port 8080");
// });







// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync");
// const ExpressError = require("./utils/expressError");
// const { reviewSchema } = require("./schema");
// const Review = require("./model/reviews.js");
// const Listing = require("./model/listing");
// const session = require('express-session')  // 
// const flash = require('connect-flash');
// const LocalStrategy = require('passport-local');
// const User = require('./model/user');
// const passport = require("passport");


// const listings = require("./routes/listing.js");
// // const Review = require("./routes/review.js");

// const reviews = require("./routes/review.js");
// app.use("/listings/:id/reviews", reviews);

// const user = require('./routes/user.js');


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(() => {
//     console.log("connected to DB");
// }).catch((err) => {
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));



// const sessionOptions = {
//   secret: 'your_secret_key_here',   // any string, keep it private
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 *60 * 1000,
//     maxAge: 7 * 24 * 60 *60 * 1000,
//     httpOnly: true
//   }
// };

// app.get("/", (req, res) => {
//     res.send("Hi i am root");
// });

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// // ✅ Replace line 67 with these three lines:
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// // passport.serializeUser(new LocalStrategy(User.authenticate()));




// app.use((req, res, next) =>{
//     res.locals.success = req.flash("success");
//     next();
// });

// // app.get("/demouser", async (req, res) =>{

// //     let fakeUser = new User({
// //         email: "student@gmail.com",
// //         username: "delta-studen"
// //     });

// //     let registredUser = await User.register(fakeUser, "Helloworld");
// //     res.send(registredUser);


// // });




// //  Listing routes — listing.js mein hain
// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);
// //user routes
// app.use("/", user);

// // Review validate
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     } else {
//         next();
//     }
// };

// // Review route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     console.log("new review saved");
//     res.redirect(`/listings/${listing._id}`);
// }));

// //  Error handler
// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong" } = err;
//     err.status = statusCode;
//     err.message = message;
//     res.status(statusCode).render("error.ejs", { err });
// });

// app.listen(8080, () => {
//     console.log("Server is listening on port 8080");
// });






// const express = require("express");
// const { default: mongoose } = require("mongoose");
// const app = express();
// const monogoose = require("mongoose");
// const Listing = require("./model/listing");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync");
// const ExpressError = require("./utils/expressError");
// const { error } = require("console");
// const {listingSchema, reviewSchema } = require("./schema");
// const Review = require("./model/reviews.js");

// const listings = require("./routes/listing.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(() => {
//     console.log("connected to DB");
// }).catch((err) => {
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }


// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));




// app.get("/" , (req, res) => {
//     res.send("Hi i am root");
// });



// app.use("/listings", listings);


// const validateReview = (req, res, next) => {
//      let {error} =  reviewSchema.validate(req.body);
  
//    if(error){
//     let errMsg = error.details.map((el) =>  el. message).join(",");
//     throw new ExpressError (404, errMsg);
//    } else {
//     next();
//    }

// };


// // index Route
// app.get("/listings", async (req, res) => {
//    const allListings = await Listing.find({});
//    res.render("listings/index.ejs", {allListings});
//     });

// // new route

// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs")
// });


// //Show Route
//     app.get("/listings/:id", async(req, res) => {
//         let {id} = req.params;
//        const listing = await Listing.findById(id);
//        res.render("listings/show.ejs", { listing });

// });

// //Create route

// app.post("/listings" ,validateListing ,wrapAsync( async (req, res, next) => {
  
//    const newListing = new Listing(req.body.listing);
//    await newListing.save();
//    res.redirect("/listings");

// })
// );


// //Edit route
// app.get("/listings/:id/edit", async(req, res) => {
//     let {id} = req.params;
//        const listing = await Listing.findById(id);
//        res.render("listings/edit.ejs", {listing})

// });

// //update route
// app.put("/listings/:id",validateListing , async(req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     redirect("/listings");
// });


// //DELETEROUTE
// app.delete("/listings/:id", async(req, res) => {
//     let { id } = req.params;
//    let deletedListing = await Listing.findByIdAndDelete(id);
//    console.log(deletedListing);
//    res.redirect("/listings");
// });




// //reviews
// //post route
// app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("new review saved");
//     res.redirect(`/listings/${listing._id}`);
// }));





// // app.post("/listings/id/reviews", async(req, res) =>{
// //     let listing = await Listing.findById(req.params.id);
// //     let newReview = new Review(req.body.review);

// //     listing.reviews.push(newReview);
// //     await newReview.save();
// //     await listing.save();

// //     console.log("new reviews  saved");
// //     res.send("new reviewsaved");

// // });





// // app.get("/testlisting",async (req, res) => {
// //     let sampleListing = new Listing({
// //         title:"My  New villa",
// //         description: "By the beach",
// //         price: 1200,
// //         location: "Goa",
// //         country: "India",
// //     });

// //      await sampleListing.save();
// //     console.log("Sample was saved");
// //     res.send("Successful testing");
// //     });



// // app.all("*", (req, res, next) => {
// //     next(new ExpressError(404, "Page Not Found"));
// // });

// // app.all("*", (req, res, next) => {
// //     next(new ExpressError(404, "Page Not Found"));
// // });

// app.use((err, req, res, next) => {
//     let {statusCode , message} = err;
//     res.render("error.ejs");
//     //res.status(statusCode).send(message);
 
// });

// app.listen(8080, () => {
//     console.log("Server is listening on port 8080");
// });