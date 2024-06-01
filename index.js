// import fs from "fs";
// import imagemagic from "gm";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import {
  afterWordAddOptions,
  initialOptions,
  startAgainOptions,
  wordOptions,
} from "./optionsSet";
import { addNewWord, getAllWords } from "./db";

dotenv.config();

const BOT_API = process.env.BOT_API;
const bot = new TelegramBot(BOT_API, {
  polling: true,
});

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
      msg.chat.username;
      await bot.sendMessage(
        msg.chat.id,
        `Привет ${msg.chat.username}, это бот для изучения слов на иностранном языке, добавляй новые слова и бот будет присылать их тебе на проверку`,
        initialOptions
      );
      return;
    }

    if (msg.text.includes(",")) {
      let word = msg.text.split(",");
      addNewWord(msg.chat.id, word[0], word[1]);
      await bot.sendMessage(
        msg.chat.id,
        "Слово добавлено",
        afterWordAddOptions
      );
      return;
    }

    bot.sendMessage(msg.chat.id, "Не понял тебя");
  } catch (error) {
    console.log(error.descriptions);
  }
});

bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  if (action === "newWord") {
    await bot.sendMessage(
      msg.chat.id,
      "Введите слово и его перевод через запятую"
    );
    return;
  }

  if (action === "training") {
    await getAllWords(msg.chat.id);

    return;
  }

  if (action === "next") {
    if (counter < initialData.length) {
      await bot.sendMessage(
        msg.chat.id,
        messageCreator(counter++),
        wordOptions
      );
    } else {
      counter = 0;
      await bot.sendMessage(
        msg.chat.id,
        "Слова для изучения закончились",
        startAgainOptions
      );
    }
    return;
  }

  if (action === "stop") {
    counter = 0;
    bot.sendMessage(msg.chat.id, "Вы остановили тренировку", {
      disable_notification: true,
    });
    return;
  }

  bot.sendMessage(msg.chat.id, "Не понял тебя");
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
