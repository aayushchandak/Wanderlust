const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");

const { validateReview, isAuthor } = require("../middlewares/review");
const { isLoggedIn } = require("../middlewares/listing");

const reviewController = require("../controllers/review");

// Add review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
