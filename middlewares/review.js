const { reviewSchema } = require("../Schema");
const Review = require("../models/review");

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const isAuthor = wrapAsync(async (req, res, next) => {
  let { reviewId , id } = req.params;
  let revData = await Review.findById(reviewId);

  if (
    res.locals.currUser &&
    !revData.author._id.equals(res.locals.currUser._id)
  ) {
    req.flash("error", "You don't have access to edit this comment");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

module.exports = { validateReview , isAuthor };
