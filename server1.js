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
const healingRouter = require('./routes/healing.js');
const feedbackRouter = require('./routes/feedback.js');


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
app.use("/", healingRouter);
app.use("/", feedbackRouter);

app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    const users = await User.find({});
    res.render("users/doc.ejs", { allListings, users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
//New Route
app.get("/listings/new", async (req, res) => {

  try {
    // Check if the user is authenticated and has the correct role
    console.log(req.user.role);
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in to create a listing.");
      return res.redirect("/login");
    }

    // Check if the user's role is 'user', restricting them from creating a listing
    if (req.user.role === 'user') {
      req.flash("error", "You do not have permission to create a listing.");
      return res.redirect("/listings");
    }
    if (req.user.role === 'doctor') {
      console.log("Successfully accessed /listings/new");
    res.render("listings/new.ejs");
    }
    // If authenticated and the role is allowed, render the 'new listing' form
    

  } catch (error) {
    // Catch any errors during execution and log them
    console.error("Error while accessing /listings/new:", error);
    req.flash("error", "An error occurred while accessing the 'create listing' page.");
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

app.get("/quizzes", (req, res) => {
  res.render('users/quizzes.ejs');
});

app.get("/stats", (req, res) => {
  res.render('users/stats.ejs');
});

app.get("/yoga", (req, res) => {
  res.render('users/yoga.ejs');
});
  
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
