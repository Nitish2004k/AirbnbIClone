const mongoose = require("mongoose");
const passportLocalMongooseModule = require("passport-local-mongoose");
const passportLocalMongoose =
    typeof passportLocalMongooseModule === "function"
        ? passportLocalMongooseModule
        : passportLocalMongooseModule.default;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose); // adds username, hash, salt, register(), authenticate()

module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose").default;

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true
//     }
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);






// // const mongoose = require("mongoose");
// // const passportLocalMongoose = require("passport-local-mongoose");

// // const userSchema = new mongoose.Schema({
// //     email: {
// //         type: String,
// //         required: true
// //     }
// // });

// // userSchema.plugin(passportLocalMongoose);

// // module.exports = mongoose.model("User", userSchema);