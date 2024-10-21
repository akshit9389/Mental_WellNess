const express = require("express");
const router=express.Router({mergeParams: true});
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");

const userRouter = require('./routes/userRoute.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/Moodmap";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");
}

main().catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const sessionOptions = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      touchAfter: 24 * 3600
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Make flash messages available in templates
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Make flash messages available in res.locals
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", userRouter);

app.get("/listings",wrapAsync( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("users/doc.ejs", { allListings });
}));
//New Route
app.get("/listings/new", async (req, res) => {
  console.log(req.user);
  try {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in to create a listing");
      return res.redirect("/login");
    } else {
      console.log("Successfully accessed /listings/new");
      res.render("listings/new.ejs");
    }  
  } catch (error) {
    console.error("Error while accessing /listings/new:", error);
    req.flash("error", "An error occurred while creating a listing");
    return res.redirect("/error");
  }
});


//Show Route
app.get("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post("/listings", wrapAsync(async (req, res, next) => {
  if (!req.body.listing) {
    throw new ExpressError(400,"Send valid data for listing")
  }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400,"Send valid data for listing")
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

app.get("/home", (req, res) => {
    res.render('users/indext.ejs');
});
app.get("/feedback", (req, res) => {
  res.render('users/feedback.ejs');
});
app.get("/healinghuddles", (req, res) => {
  res.render('users/hh.ejs');
});
  
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
