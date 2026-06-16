const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lawyerRoutes = require("./routes/lawyerRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// MIDDLEWARE
// ======================

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
      const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // PENTING untuk cookie
  })
);

app.use(express.json());
app.use(cookieParser());

// ======================
// API ROUTES
// ======================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// ======================
// HEALTH CHECK
// ======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Counsela API berjalan dengan baik ⚖️",
  });
});

// ======================
// 404 HANDLER
// ======================

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route tidak ditemukan",
  });
});

// ======================
// GLOBAL ERROR HANDLER
// ======================

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ======================
// START SERVER
// ======================
module.exports = app;

// Jalankan jika bukan di Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("======================================");
    console.log(`🚀 Counsela Server berjalan di port ${PORT}`);
    console.log("======================================");
  });
}