const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((el) => ({
    ...el,
    owner: "6533ba7aee29fa30db7b2826",
    country:el.country.toLowerCase(),
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initializes");
};
initDB();
