// import dependencies
import express from "express";
import env from "./config/env.js";
import connectDB from "./config/db.js";

const app = express();

const startServer = async () => {
  await connectDB();

  const PORT = env.PORT || 8000;
  app.get("/", (req, res) => {
    let a = req.url;
    res.send("<h1>Welcome to the confidential backend Server "+a+"</h1>");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
