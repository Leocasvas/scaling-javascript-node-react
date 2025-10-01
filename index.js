const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./configuration/keys");
require("./models/user");
require("./Services/Passport");

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

// Shim to satisfy Passport's expectation of req.session.regenerate and req.session.save
// when using cookie-session, which does not provide these methods.
app.use((req, res, next) => {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => cb && cb();
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => cb && cb();
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

require("./Routes/AuthRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
