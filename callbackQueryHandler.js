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
let messageToDelete = {}; // содержит id пользователей и массив id сообщений которые необходио удалить после завершения тренировки

export async function callbackQueryHandler(action, msg, bot) {
  try {
    switch (action) {
      case "newWord":
        await newWordAdditionMessage(msg.chat.id, bot);
        break;
      case "training":
        await startTraining(msg.chat.id, bot);
        break;
      case "next":
        await editCountToEndMessageText(msg.chat.id, bot);
        await sendWordsForUser(msg.chat.id, bot);
        break;
      case "stop":
        await stopTraining(msg.chat.id, bot);
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

let stopTraining = async function (chatID, bot) {
  counter[chatID] = 0;
  deleteProgressMessages(chatID, bot);
  bot.sendMessage(chatID, "Вы остановили тренировку", startOptions);
};

let startTraining = async function (chatID, bot) {
  allWords[chatID] = await getAllWords(chatID);
  let totalWordsMessage = await bot.sendMessage(
    chatID,
    `Всего слов: ${allWords[chatID].length}`,
    {
      disable_notification: true,
    }
  );
  let wordsToEndMessage = await bot.sendMessage(
    chatID,
    `Слов до конца тренировки: ${allWords[chatID].length}`,
    {
      disable_notification: true,
    }
  );
  messageToDelete[chatID] = [];
  messageToDelete[chatID].push(
    totalWordsMessage.message_id,
    wordsToEndMessage.message_id
  );
  counter[chatID] = 0;
  await sendWordsForUser(chatID, bot);
};

let newWordAdditionMessage = async function (chatID, bot) {
  await bot.sendMessage(
    chatID,
    "Введите слово и перевод через тире\nhello - привет\nhome - дом, жилье",
    startOptions
  );
};

let sendWordsForUser = async function (id, bot) {
  if (counter[id] < allWords[id].length) {
    await bot.sendMessage(id, messageCreator(counter[id], id), wordOptions);
    counter[id] = counter[id] + 1;
  } else {
    counter[id] = 0;
    deleteProgressMessages(id, bot);
    await bot.sendMessage(
      id,
      `Слов изучено: ${allWords[id].length}`,
      startOptions
    );
  }
};

let messageCreator = function (wordNumber, id) {
  let text = "";
  if (allWords[id][wordNumber]) {
    text = `${allWords[id][wordNumber].word} - <span class="tg-spoiler">${allWords[id][wordNumber].translate}</span>`;
  }
  return text;
};

let deleteProgressMessages = function (chatID, bot) {
  messageToDelete[chatID].forEach((msgID) => {
    bot.deleteMessage(chatID, msgID);
  });
};

let editCountToEndMessageText = async function name(chatID, bot) {
  let wordsToEnd = allWords[chatID].length - counter[chatID];
  await bot.editMessageText(`Слов до конца тренировки: ${wordsToEnd}`, {
    chat_id: chatID,
    message_id: messageToDelete[chatID][1],
  });
};
