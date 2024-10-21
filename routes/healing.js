const express = require('express');
const router = express.Router();
const Healing = require('../models/hh.js');
const passport = require("passport");

// Healing Sessions Route (Index Route)
router.get("/healings", async (req, res) => {
  try {
    const allHealings = await Healing.find({});
    res.render("users/hh.ejs", { allHealings });
  } catch (error) {
    console.error("Error fetching healings:", error);
    req.flash("error", "An error occurred while fetching healing sessions.");
    res.redirect("/error");
  }
});

// New Healing Session Route (Form to create new healing session)
router.get("/healings/new", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be logged in to create a healing session");
      return res.redirect("/login");
    } else {
      console.log("Successfully accessed /healings/new");
      res.render("listings/newh.ejs");
    }
  } catch (error) {
    console.error("Error while accessing /healings/new:", error);
    req.flash("error", "An error occurred while accessing the new session page.");
    return res.redirect("/error");
  }
});

// Show Route (Show details of a specific healing session)
router.get("/healings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const healing = await Healing.findById(id);
    res.render("listings/showh.ejs", { healing });
  } catch (error) {
    console.error("Error fetching healing session:", error);
    req.flash("error", "An error occurred while fetching the healing session.");
    res.redirect("/error");
  }
});

// Create Route (POST to create new healing session)
router.post("/healings", async (req, res) => {
  try {
    if (!req.body.healing) {
      req.flash("error", "Invalid data for healing session");
      return res.redirect("/healings/new");
    }
    const newHealing = new Healing(req.body.healing);
    await newHealing.save();
    res.redirect("/healings");
  } catch (error) {
    console.error("Error creating new healing session:", error);
    req.flash("error", "An error occurred while creating the healing session.");
    res.redirect("/error");
  }
});

// Edit Route (Edit form for healing session)
router.get("/healings/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const healing = await Healing.findById(id);
    res.render("listings/edith.ejs", { healing });
  } catch (error) {
    console.error("Error accessing edit form:", error);
    req.flash("error", "An error occurred while fetching the healing session for editing.");
    res.redirect("/error");
  }
});

// Update Route (PUT to update healing session)
router.put("/healings/:id", async (req, res) => {
  try {
    if (!req.body.healing) {
      req.flash("error", "Invalid data for healing session update");
      return res.redirect(`/healings/${req.params.id}/edit`);
    }
    const { id } = req.params;
    await Healing.findByIdAndUpdate(id, { ...req.body.healing });
    res.redirect(`/healings/${id}`);
  } catch (error) {
    console.error("Error updating healing session:", error);
    req.flash("error", "An error occurred while updating the healing session.");
    res.redirect("/error");
  }
});

// Delete Route (DELETE to remove a healing session)
router.delete("/healings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHealing = await Healing.findByIdAndDelete(id);
    console.log(deletedHealing);
    res.redirect("/healings");
  } catch (error) {
    console.error("Error deleting healing session:", error);
    req.flash("error", "An error occurred while deleting the healing session.");
    res.redirect("/error");
  }
});

module.exports = router;
