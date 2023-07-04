import express from "express";
import fetch from "node-fetch";
import { Telegraf } from "telegraf";

const app = express();
const port = process.env.PORT || 4000;

const formatResponse = (response) => {
  return response.data.map((item) => {
    return {
      price: item.adv.price,
      minimum: item.adv.minSingleTransAmount,
      maximum: item.adv.maxSingleTransAmount,
      bgColor: item.adv.tradeMethods[0].tradeMethodBgColor,
      user: item.advertiser.nickName,
      positiveRate: item.advertiser.positiveRate,
    };
  });
};

// Function to send a message using the Telegram bot
const sendMessageToTelegram = async (message) => {
  try {
    await bot.telegram.sendMessage(chatId, message);
  } catch (err) {
    console.error("Error sending message to Telegram:", err);
  }
};

const getWiseData = async () => {
  data.payTypes = [payTypes[1]];
  const responseDataWise = await fetch(
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
    {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const responseJsonWise = await responseDataWise.json();
  const salePricesWise = responseJsonWise.data
    .slice(0, 10)
    .map((item) => item.adv.price);
  messageWise = `Here are the first 10 Wise sale prices:\n${salePricesWise.join(
    "\n"
  )}`;

  return formatResponse(responseJsonWise);
};

const getSkrillData = async () => {
  data.payTypes = [payTypes[0]];
  const responseDataSkrill = await fetch(
    "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
    {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const responseJsonSkrill = await responseDataSkrill.json();

  const salePricesSkrill = responseJsonSkrill.data
    .slice(0, 10)
    .map((item) => item.adv.price);

  messageSkrill = `Here are the first 10 Skrill sale prices:\n${salePricesSkrill.join(
    "\n"
  )}`;
  return formatResponse(responseJsonSkrill);
};

const headers = {
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "Content-Length": "123",
  "content-type": "application/json",
  Host: "p2p.binance.com",
  Origin: "https://p2p.binance.com",
  Pragma: "no-cache",
  TE: "Trailers",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
};

const payTypes = ["SkrillMoneybookers", "Wise"];

const data = {
  asset: "USDT",
  tradeType: "BUY",
  fiat: "USD",
  transAmount: 0,
  order: "",
  page: 1,
  rows: 10,
  filterType: "all",
};
let messageWise = "";
let messageSkrill = "";

app.get("/send-message", (req, res) => {
  sendMessageToTelegram(messageWise);
  sendMessageToTelegram(messageSkrill);
  res.redirect("/");
});

app.get("/", async (req, res) => {
  try {
    const wise = await getWiseData();
    const skrill = await getSkrillData();
    res.status(200).send({ wise: wise, skrill: skrill });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching sale prices.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Telegram bot setup (add your TELEGRAM_BOT_TOKEN and CHAT_ID)
const bot = new Telegraf("6166277288:AAELNkzLdfsP3NA8NmeD0v_WhzC8PPYYXf8");
const chatId = "832635798";

bot.launch().then(() => {
  console.log("Telegram bot is running.");
});
