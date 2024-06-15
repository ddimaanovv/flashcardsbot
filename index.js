// import fs from "fs";
// import imagemagic from "gm";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { callbackQueryHandler } from "./callbackQueryHandler.js";
import { botOnTextHandler } from "./botOnTextHandler.js";

dotenv.config();
try {
  const BOT_API = process.env.BOT_API;
  const bot = new TelegramBot(BOT_API, {
    polling: true,
  });

  bot.on("text", async (msg) => {
    console.log(msg.id);
    await botOnTextHandler(msg, bot);
  });

  bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
    bot.deleteMessage(
      callbackQuery.message.chat.id,
      callbackQuery.message.message_id
    );
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    await bot.answerCallbackQuery(callbackQuery.id);
    await callbackQueryHandler(action, msg, bot);
  });
} catch (error) {
  console.log(error.response.body);
}

// bot.on('text', async msg => {
//   if (msg.text == '/start') {
//       await bot.sendPhoto(msg.chat.id, './drawing1.png');
//       await bot.sendPhoto(msg.chat.id, './drawing.png', {has_spoiler: true});
//   }
// })

// const gm = imagemagic.subClass({ imageMagick: '7+' });

// gm('./background_grey.jpg')
// //.resize(800,800)
// .fill("#000")
// .font("Helvetica.ttf", 80)
// .drawText(0, 0, "IMPLEMENT", 'center')
// .in('-weight', 'Bold')
// .write("./drawing1.png", function (err) {
//   if (!err) {
//     console.log('done')
//   } else {
//     console.log(err);
//   }
// });
