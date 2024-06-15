import { getAllWords } from "./db.js";
import { startAgainOptions, startOptions, wordOptions } from "./optionsSet.js";

let counter = 0;
let allWords = [];

export async function callbackQueryHandler(action, msg, bot) {
  try {
    switch (action) {
      case "newWord":
        await bot.sendMessage(
          msg.chat.id,
          "Введите слово и перевод через тире\nhello - привет\nhome - дом, жилье",
          startOptions
        );
        break;
      case "training":
        allWords = await getAllWords(msg.chat.id);
        await sendWordsForUser(msg.chat.id, bot);
        break;
      case "next":
        await sendWordsForUser(msg.chat.id, bot);
        break;
      case "stop":
        counter = 0;
        bot.sendMessage(msg.chat.id, "Вы остановили тренировку", startOptions);
        break;
      default:
        bot.sendMessage(msg.chat.id, "Не понял тебя callback_query");
        break;
    }
  } catch (error) {
    console.log(error.response.body);
  }
}

let sendWordsForUser = async function (id, bot) {
  if (counter < allWords.length) {
    await bot.sendMessage(id, messageCreator(counter++), wordOptions);
  } else {
    counter = 0;
    await bot.sendMessage(
      id,
      "Слова для изучения закончились",
      startAgainOptions
    );
  }
};

let messageCreator = function (wordNumber) {
  let text = "";
  if (allWords[wordNumber]) {
    text = `${allWords[wordNumber].word} - <span class="tg-spoiler">${allWords[wordNumber].translate}</span>`;
  }
  return text;
};
