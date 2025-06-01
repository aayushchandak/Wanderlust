const User = require("../models/user");

const signupForm = (req, res) => {
  res.render("users/signup.ejs");
};

const addNewUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });

    let regUser = await User.register(newUser, password);

    req.login(regUser, (e) => {
      if (e) {
        next(e);
      } else {
        req.flash("success", "User signed up successfully");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/users/signup");
  }
};

const loginForm = (req, res) => {
  res.render("users/login.ejs");
};

const loginUser = async (req, res) => {
  req.flash("success", "Welcome to Zentrek!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const logoutUser = (req, res) => {
  req.logout((e) => {
    if (e) {
      next(e);
    } else {
      req.flash("success", "User logged out successfully");
      res.redirect("/listings");
    }
  });
};

module.exports = { signupForm, addNewUser, loginForm, loginUser, logoutUser };
