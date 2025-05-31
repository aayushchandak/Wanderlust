const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Listing = require("../models/listing");
const { listingSchema } = require("../Schema");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to continue");
    return res.redirect("/users/login");
  }
  next();
};

const isOwner = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  id = id.trim();
  let listData = await Listing.findById(id);

  if (
    res.locals.currUser &&
    !listData.owner._id.equals(res.locals.currUser._id)
  ) {
    req.flash("error", "You don't have access to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate({ listing: req.body });

  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const validateUpdatedListing = (req, res, next) => {
  let listing = req.body.updateListing;
  const { error } = listingSchema.validate({ listing });

  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isOwner,
  validateListing,
  validateUpdatedListing,
};
