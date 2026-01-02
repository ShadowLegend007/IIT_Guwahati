import express from "express";
import cors from "cors";
import dataEntry from "./routes/dataEntry.js";

const app = express();

// ---------- Global Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use("/api/input", dataEntry);

// Health Check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "API is running" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
