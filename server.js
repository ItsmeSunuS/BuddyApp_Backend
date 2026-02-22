const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// UserRoutes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

//workoutRoutes
const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workouts", workoutRoutes);

//messageRoutes
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const challengeRoutes = require("./routes/challengeRoutes");
app.use("/api/challenges", challengeRoutes);

//groupRoutes
const groupRoutes = require("./routes/groupRoutes");
app.use("/api/groups", groupRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Fitnessbuddy API is running...");
});
//const PORT=5050;
const PORT = process.env.PORT || 5000;

 //console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));