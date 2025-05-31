if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");
const { log } = require("console");

const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRouters = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SECRET,
  },
});

const sessionOptions = {
  store : sessionStore,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.deleteMsg = req.flash("deleteMsg");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/users", userRouters);

app.all("*", (req, res, next) => {
  next(new ExpressError(400, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 400, message = "Error 404 : Bad Gateway" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
