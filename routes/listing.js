const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync");

const listingController = require("../controllers/listing");

const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateUpdatedListing,
} = require("../middlewares/listing");

router
  .route("/")
  // Home page ( Show All Listings)
  .get(wrapAsync(listingController.getListings))
  // Add New Listing
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.newListing)
  );


//Add New Listing Form
router.get("/new", isLoggedIn, listingController.newListingForm);

router
  .route("/:id")
  // Show Listing
  .get(wrapAsync(listingController.showListing))
  // Update Listing
  .put(
    isLoggedIn,
    upload.single("updateListing[image]"),
    validateUpdatedListing,
    isOwner,
    wrapAsync(listingController.updateListing)
  )
  // Delete Listing
  .delete(isOwner, isLoggedIn, wrapAsync(listingController.deleteListing));

// Update Listing Form
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.updateListingForm)
);

module.exports = router;
