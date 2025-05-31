const Listing = require("../models/listing");
const Review = require("../models/review");

const addReview = async (req, res) => {
  let listingsData = await Listing.findById(req.params.id);

  let rev = new Review(req.body.review);

  rev.author = res.locals.currUser._id;
  listingsData.reviews.push(rev);

  await rev.save();
  await listingsData.save();

  req.flash("success", "Review added successfully! ");
  res.redirect(`/listings/${req.params.id}`);
};

const deleteReview = async (req, res) => {
  let listingsData = await Listing.findById(req.params.id);
  // console.log(req.body.review);
  await Review.findByIdAndDelete(req.params.reviewId);

  listingsData.reviews.pull(req.params.reviewId);

  await listingsData.save();

  req.flash("deleteMsg", "Review deleted successfully! ");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports = { addReview, deleteReview };
