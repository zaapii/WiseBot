import express from 'express';
import fetch from 'node-fetch';
import { Telegraf } from 'telegraf'
import cron from 'node-cron';

const app = express();
const port = process.env.PORT || 3000;

const headers = {
  "Accept": "*/*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  "Connection": "keep-alive",
  "Content-Length": "123",
  "content-type": "application/json",
  "Host": "p2p.binance.com",
  "Origin": "https://p2p.binance.com",
  "Pragma": "no-cache",
  "TE": "Trailers",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
};

const data = {
  asset: 'USDT',
  tradeType: 'BUY',
  fiat: 'USD',
  transAmount: 0,
  order: '',
  page: 1,
  rows: 10,
  filterType: 'all',
  "payTypes": ['Wise'],
};

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const chatId = process.env.CHAT_ID;

async function sendSalePrices() {
  const responseData = await fetch(
    'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
    {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  if (!responseData.ok)
    throw 'bad response';

  const jsonData = await responseData.json();

  const salePrices = jsonData.data.slice(0, 10).map(item => item.adv.price);

  const message = `Here are the first 10 sale prices:\n${salePrices.join('\n')}`;

  bot.telegram.sendMessage(chatId, message);
}

// Schedule the function to run every hour
cron.schedule('00 59 * * * *', () => {
  sendSalePrices().catch(err => console.error(err));
});

// Route to handle requests
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
