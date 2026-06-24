const User = require("../model/user.js");


// Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// Signup User
module.exports.signup = async (req, res, next) => {
    try {

        let { username, email, password } = req.body;

        const newUser = new User({
            username,
            email
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        console.log(registeredUser);

        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                "Welcome to Wanderlust!"
            );

            res.redirect("/listings");
        });


    } catch (e) {

        req.flash(
            "error",
            e.message
        );

        res.redirect("/signup");
    }
};



// Render Login Form
module.exports.renderLoginForm = (req, res) => {

    res.render("users/login.ejs");

};



// Login User
module.exports.login = async (req, res) => {

    req.flash(
        "success",
        "Welcome back to Wanderlust!"
    );

    let redirectUrl = 
        res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);

};



// Logout User
module.exports.logout = (req, res, next) => {


    req.logout((err) => {

        if(err) {

            return next(err);

        }


        req.flash(
            "success",
            "You are logged out now"
        );


        res.redirect("/listings");

    });

};






// moduleUser = require("../model/user")

// module.exports.renderSingupForm = (req, res) => {
//     res.render("users/signup.ejs");
// };

// module.exports.singup = async (req, res, next) => {
//     try {
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);
//         console.log(registeredUser);
//         req. login(registeredUser, (err) =>{
//             if(err) {
//                 return next(err);
//             }
//             req. flash("success", "Welcome to underlust!");
//             res.redirect("/listings");
//         });
       
//     } catch (e) {
//         req.flash("error", e.meggage);
//         res.redirect("/signup");
//     }
// };


// module.exports.renderLoginForm = (req, res) => {
//     res.render("users/login.ejs");
// };


// module.exports.login = async (req, res) =>{
//     req.flash("success", "Welcome back to Wanderlust!");
//     let redirectUrl = (res.locals.redirectUrl || "/listings");
//     res.redirect(redirectUrl)

// };


// module.exports.logout = (req, res, next) => {
//     req.logout((err) => {
//         if(err) {
//            return next(err);

//         }
//         req.flash("success", "Your are logout now");
//         res.redirect("/listings");
//     })
// };