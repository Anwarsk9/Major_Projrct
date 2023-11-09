const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let { filters, country } = req.query;
  res.locals.filter = filters;
  if (filters && filters != "home") {
    const data = await Listing.find({ category: filters });
    return res.render("./listings/index.ejs", { data, filters });
  }
  if (country) {
    const data = await Listing.find({
      $or: [{ country: country }, { location: country }],
    });
    if (data == "") {
      req.flash("error", "No Listing Found!");
      return res.redirect("/listings");
    }
    return res.render("./listings/index.ejs", { data });
  }
  const data = await Listing.find();
  if (!data) {
    req.flash("error", "Something Wrong With Database");
  }
  res.render("./listings/index.ejs", { data });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  const apiKey = process.env.MAP_TOKEN;
  let api = await fetch(
    `https://api.maptiler.com/geocoding/${req.body.listing.location}.json?key=${apiKey}`
  );
  let response = await api.json();

  const { path: url, filename } = req.file;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.features[0].geometry;
  const savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "new listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listings = await Listing.findById({ _id: id })
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listings) {
    req.flash("error", "Listing you requested for dosn't exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { data: listings });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  const originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/w_250"
  );
  res.render("./listings/edit.ejs", { data: listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { location } = req.body.listing;
  let coordinatListing = await Listing.findById(id);

  if (coordinatListing.location !== location) {
    console.log("coordinates updated");
    const apiKey = process.env.MAP_TOKEN;
    let api = await fetch(
      `https://api.maptiler.com/geocoding/${location}.json?key=${apiKey}`
    );
    let response = await api.json();
    coordinatListing.geometry = response.features[0].geometry;
    coordinatListing.save();
  }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing edited!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete({ _id: id }).then((e) => {
    console.log(e);
  });
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
