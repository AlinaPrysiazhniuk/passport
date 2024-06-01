import "dotenv/config";
import express from "express";
import "./strategies/google.js";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";

const app = express();
const { DB_URI, PORT } = process.env;

app.use(
  session({ secret: "password", resave: false, saveUninitialized: true })
);

app.use(passport.initialize());

app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

app.get("/", (req, res) => {
  res.send(`<a href="/google">Login with google</a>`);
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`<a href="/logout">Logout</a>`);
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Good bye");
  });
});

app.get("/google/failure", (req, res) => {
  res.send("Failed login with goggle");
});

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/google/failure",
  })
);

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
