import { startOptions, initialOptions } from "./optionsSet.js";
import { addNewWord } from "./db.js";

export async function botOnTextHandler(msg, bot) {
  try {
    let action = msg.text.includes("-") ? "addWord" : msg.text;
    switch (action) {
      case "/start":
        msg.chat.username;
        await bot.sendMessage(
          msg.chat.id,
          `Привет ${msg.chat.username}, это бот для изучения слов на иностранном языке, добавляй новые слова и бот будет присылать их тебе на проверку`,
          initialOptions
        );
        break;
      case "addWord":
        let word = msg.text.split("-");
        addNewWord(msg.chat.id, word[0].trim(), word[1].trim());
        await bot.sendMessage(msg.chat.id, "Слово добавлено", startOptions);
        break;
      default:
        bot.sendMessage(msg.chat.id, "Не понял тебя text");
        break;
    }
  } catch (error) {
    bot.sendMessage(msg.chat.id, "Не понял тебя error text");
    console.log(error.response.body);
  }
}
