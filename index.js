import fs from "fs";
import imagemagic from "gm";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const BOT_API = process.env.BOT_API;
console.log(BOT_API);
let initialData = [
  {
    word: "home",
    translate: "дом",
  },
  { word: "car", translate: "машина" },
  {
    word: "table",
    translate: "стол",
  },
];

const bot = new TelegramBot(BOT_API, {
  polling: true,
});

let options = {
  parse_mode: "HTML",
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Далее", callback_data: "next" }],
      [{ text: "Стоп", callback_data: "stop" }],
    ],
  }),
};

let counter = 0;
let messageCreator = function (wordNumber) {
  let text = "";
  if (initialData[wordNumber]) {
    text = `${initialData[wordNumber].word} - <span class="tg-spoiler">${initialData[wordNumber].translate}</span>`;
  }
  return text;
};

bot.on("text", async (msg) => {
  try {
    if (msg.text == "/start") {
      await bot.sendMessage(msg.chat.id, messageCreator(counter++), options);
    }
  } catch (error) {
    console.log(error);
  }
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === "next") {
    bot.sendMessage(msg.chat.id, messageCreator(counter++), options);
  }
  if (action === "stop") {
    counter = 0;
    bot.sendMessage(msg.chat.id, "Вы остановили тренировку");
  }
});

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
