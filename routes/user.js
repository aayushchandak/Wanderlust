const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const passport = require("passport");

const { saveRedirectUrl, validateUser } = require("../middlewares/user");

const userController = require("../controllers/user");

router
  .route("/signup")
  // SignUp Form
  .get(userController.signupForm)
  // Registering new User
  .post(validateUser, wrapAsync(userController.addNewUser));

router
  .route("/login")
  // Loging User Form
  .get(userController.loginForm)
  // Login User
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    wrapAsync(userController.loginUser)
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
