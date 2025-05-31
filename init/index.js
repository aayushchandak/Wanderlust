const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function initDB() {
  await Listing.deleteMany({});
  console.log("Data deleted");
  initData.data = initData.data.map((el) => ({
    ...el,
    owner: "68309771fbbc7d6ab097aa1f",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data inserted");
}

initDB();
