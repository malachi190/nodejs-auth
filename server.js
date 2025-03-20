require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const dbConn = require("./database/db");

const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const imageRoutes = require("./routes/image-routes");

// Connect to database
dbConn();

// Use middleware
app.use(express.json());

// add auth routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload/", imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
