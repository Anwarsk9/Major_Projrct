const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  newReview.author = req.user;
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId).then((result) => {
    console.log(result);
  });
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
