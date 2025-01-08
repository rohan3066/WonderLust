const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/signUp")
  .get(userController.renderSignUpPage)
  .post(wrapAsync(userController.addUser));
  
router
  .route("/login")
  .get(userController.renderLoginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.addLogedInUser
  );

//userLogedOut
router.get("/logout", userController.userLoggedOut);

module.exports = router;
