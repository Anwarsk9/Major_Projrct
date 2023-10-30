const express = require("express");
const router = express.Router({ mergeParams: true });
const { wrapAsync } = require("../utils/wrapAsync.js");

const {
  isLoggedIn,
  isReviewOwner,
  validateReview,
} = require("../middleware.js");

const reviewController = require("../controller/review.js");

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Destroy Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
