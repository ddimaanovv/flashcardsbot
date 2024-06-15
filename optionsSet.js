let initialOptions = {
  parse_mode: "HTML",
  disable_notification: true,
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Добавить слово", callback_data: "newWord" }]],
  }),
};

let startOptions = {
  parse_mode: "HTML",
  disable_notification: true,
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Добавить слово", callback_data: "newWord" }],
      [{ text: "Начать тренировку", callback_data: "training" }],
    ],
  }),
};

let wordOptions = {
  parse_mode: "HTML",
  disable_notification: true,
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Далее", callback_data: "next" },
        { text: "Стоп", callback_data: "stop" },
      ],
    ],
  }),
};

let startAgainOptions = {
  parse_mode: "HTML",
  disable_notification: true,
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Начать сначала", callback_data: "training" }]],
  }),
};

export { wordOptions, startAgainOptions, initialOptions, startOptions };
