import { getAllWords } from "./db.js";
import { startOptions, wordOptions } from "./optionsSet.js";

let counter = {}; // содержит id пользователей и счетчик их слов во время тренировки
// {
//   id1: count,
//   id2: count
// }
let allWords = {}; // содержит id пользователей и массив слов для тренировки
// {
//   id1: [{word:"qwe", translate: "qwe"}, {word:"asd", translate: "asd"}],
//   id2: [{word:"qwe", translate: "qwe"}]
// }

export async function callbackQueryHandler(action, msg, bot) {
  try {
    switch (action) {
      case "newWord":
        await newWordAdditionMessage(msg.chat.id, msg.message_id, bot);
        break;
      case "training":
        await startTraining(msg.chat.id, msg.message_id, bot);
        break;
      case "next":
        await sendWordsForUser(msg.chat.id, msg.message_id, bot);
        break;
      case "stop":
        await stopTraining(msg.chat.id, msg.message_id, bot);
        break;
      default:
        bot.sendMessage(msg.chat.id, "Не понял тебя callback_query");
        break;
    }
  } catch (error) {
    if (error.response !== undefined) {
      console.log(error.response.body);
    } else {
      console.log(error);
    }
  }
}

let stopTraining = async function (chatID, msgID, bot) {
  counter[chatID] = 0;
  bot.editMessageText("Вы остановили тренировку", {
    chat_id: chatID,
    message_id: msgID,
    ...startOptions,
  });
};

let startTraining = async function (chatID, msgID, bot) {
  allWords[chatID] = await getAllWords(chatID);
  counter[chatID] = 0;
  await sendWordsForUser(chatID, msgID, bot);
};

let newWordAdditionMessage = async function (chatID, msgID, bot) {
  await bot.editMessageText(
    "Введите слово и перевод через тире\nhello - привет\nhome - дом, жилье",
    {
      chat_id: chatID,
      message_id: msgID,
      ...startOptions,
    }
  );
};

let sendWordsForUser = async function (chatID, msgID, bot) {
  if (counter[chatID] < allWords[chatID].length) {
    await bot.editMessageText(
      totalWordsMessage(chatID) +
        "\n" +
        wordsToEndMessage(chatID) +
        "\n\n" +
        messageCreator(counter[chatID], chatID),
      {
        chat_id: chatID,
        message_id: msgID,
        ...wordOptions,
      }
    );
    counter[chatID] = counter[chatID] + 1;
  } else {
    counter[chatID] = 0;
    await bot.editMessageText(`Слов изучено: ${allWords[chatID].length}`, {
      chat_id: chatID,
      message_id: msgID,
      ...startOptions,
    });
  }
};

let totalWordsMessage = function (chatID) {
  return `Всего слов: ${allWords[chatID].length}`;
};
let wordsToEndMessage = function (chatID) {
  let wordsToEnd = allWords[chatID].length - counter[chatID];
  return `Слов до конца тренировки: ${wordsToEnd}`;
};

let messageCreator = function (wordNumber, id) {
  let text = "";
  if (allWords[id][wordNumber]) {
    text = `${allWords[id][wordNumber].word} - <tg-spoiler>${allWords[id][wordNumber].translate}</tg-spoiler>`;
    //text = `${allWords[id][wordNumber].word} \\- ||${allWords[id][wordNumber].translate}||`;
  }
  return text;
};
