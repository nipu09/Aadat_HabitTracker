require("dotenv").config();

const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");

// Import routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const habitsRoutes = require("./routes/habits.js");

const app = express();

// Enable CORS for your React frontend
app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP actions
  credentials: true // Allow cookies/auth headers if needed
}));

express.urlencoded()
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

connectDB()


app.get("/", (req, res) => {
  res.send("its working properly");
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes); 
app.use("/habits", habitsRoutes); 

app.listen(PORT || 5000, () => {
  console.log(`server is running on ${PORT}`);
});
