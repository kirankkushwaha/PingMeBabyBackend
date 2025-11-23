 
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const reminderRoutes = require("./routes/reminders");
const reminderCron = require("./jobs/reminderCron");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");

  // Start cron job
  reminderCron.start();

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
});
