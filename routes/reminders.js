 
const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const protect = require("../middleware/auth");

// ✅ Create a new reminder
router.post("/", protect, async (req, res) => {
  const { title, url, note, time } = req.body;

  try {
    const reminder = new Reminder({
      user: req.user._id,
      title,
      url,
      note,
      time,
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create reminder" });
  }
});

// ✅ Get all reminders for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ time: 1 });
    res.status(200).json(reminders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
});

module.exports = router;
