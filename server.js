const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(
  express.json({
    limit: "1mb"
  })
);


/* =========================
   BASIC ROUTES
========================= */

app.get("/", (req, res) => {

  res.json({
    success: true,
    app: "Brother's Panel Backend",
    version: "1.0.0",
    status: "online"
  });

});


app.get("/health", (req, res) => {

  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime()
  });

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {

  console.log(
    `Brother's Panel Backend running on port ${PORT}`
  );

});
