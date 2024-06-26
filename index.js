/**
что нужно сделать:
3) возможно есть смысл не удалять слово при тренировке, а редактировать
  - сделал два варианта, с удалением и редактированием, редактирование не работает, ибо если пользователь открыл спойлер,
    то при редактировании спойлер не стрывается, нужно либо выходить из бота, либо немного отлистать вверх и вернуться, кароче отстой
3) добавить рандом при изучении слов, а то сейчас они идут по порядку
4) добавить тренировку с русского на английский, сейчас только с английского на русский
 
*/
// import fs from "fs";
// import imagemagic from "gm";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { callbackQueryHandler } from "./callbackQueryHandler new.js";
import { botOnTextHandler } from "./botOnTextHandler.js";

dotenv.config();
try {
  // eslint-disable-next-line
  const BOT_API = process.env.BOT_API;
  const bot = new TelegramBot(BOT_API, {
    polling: true,
  });

  bot.on("text", async (msg) => {
    console.log(msg.id);
    await botOnTextHandler(msg, bot);
  });

  bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    await callbackQueryHandler(action, msg, bot);
    await bot.answerCallbackQuery(callbackQuery.id);
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
