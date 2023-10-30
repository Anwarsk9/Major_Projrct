const Listing = require("./models/listing");
const Review = require("./models/review.js")
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/expressError.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.requestedUrl = req.originalUrl;
    req.flash("error", "you must be login to access");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.requestedUrl;
  next();
};

module.exports.isOwner = async (req,res,next)=>{
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (! listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have perission to edit!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.isReviewOwner = async (req,res,next)=>{
  const { reviewId,id } = req.params;
  let review = await Review.findById(reviewId);
  review = await review.populate("author");
  if (! review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//listing server side validation.
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
