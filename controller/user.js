const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to wanderlust!");
  //to redirect where user req
  if (res.locals.redirectUrl === undefined) {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
  }
  let redirectUrl = res.locals.redirectUrl.split("/reviews")[0] || "/listings";
  res.redirect(redirectUrl);
};

module.exports.lagout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "logged you out!");
    res.redirect("/listings");
  });
};
