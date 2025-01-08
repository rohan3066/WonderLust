const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
let { isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { storage } = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });


const validatingListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'), validatingListing, wrapAsync(listingController.addListing));


//NEW LISTING
router.get("/new", isLoggedIn, listingController.newListing);

//show Listing

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isOwner,
    upload.single('listing[image]'),
    isLoggedIn,
    validatingListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isOwner, isLoggedIn, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

module.exports = router;
