const Listing = require("../models/listing");

const getListings = async (req, res) => {
  let listingsData = await Listing.find({});
  // console.log(listingsData);
  // res.send("wait");
  res.render("./listings/index.ejs", { listingsData });
};

const newListingForm = (req, res) => {
  res.render("./listings/form.ejs");
};

const newListing = async (req, res, next) => {
  // console.log(req.file);

  let url = req.file.path;
  let filename = req.file.filename;

  let { title, description, price, location, country } = req.body;

  const newListing = new Listing({
    title,
    description,
    image: { url, filename },
    price,
    location,
    country,
  });

  // console.log(res.locals.currUser);
  newListing.owner = res.locals.currUser._id;
  newListing.image = { url, filename };
  req.flash("success", "Listing added successfully! ");
  await newListing.save();
  res.redirect("/listings");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  let listingsData = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(typeof(listingsData.price));
  // res.send("wait");

  if (!listingsData) {
    req.flash("error", " Listing you searched for doesn't exist !");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listingsData });
};

const updateListingForm = async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  let listingsData = await Listing.findById(id);
  if (!listingsData) {
    req.flash("error", "Listing you wanted to edit doesn't exist !");
    res.redirect("/listings");
  }
  // console.log(listingsData);
  let ogLink = listingsData.image.url;
  ogLink = ogLink.replace("/upload", "/upload/h_300,w_350");
  res.render("./listings/update.ejs", { listingsData, ogLink });
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  let updateListing = req.body.updateListing;

  let listing = await Listing.findByIdAndUpdate(id, updateListing, {
    runValidators: true,
    new: true,
  });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  // console.log(updateListing);

  req.flash("success", "Listing Updated successfully!");
  res.redirect(`/listings/${id}`);
};

const deleteListing = async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  // res.send("hiii");
  // console.log(id);
  await Listing.findByIdAndDelete(id);
  req.flash("deleteMsg", "Listing deleted successfully! ");
  res.redirect("/listings");
};

module.exports = {
  getListings,
  newListingForm,
  newListing,
  showListing,
  updateListingForm,
  updateListing,
  deleteListing,
};
