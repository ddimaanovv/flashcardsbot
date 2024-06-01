import sqlite3 from "sqlite3";
import { open } from "sqlite";

const DB_NAME = "flashCardsDB";
let db;

(async () => {
  db = await open({
    filename: "./tgdb.sqlite",
    driver: sqlite3.Database,
  });

  const query = `CREATE TABLE IF NOT EXISTS ${DB_NAME}
    (id integer primary key, userID TEXT, word TEXT, translate TEXT)`;
  await db.run(query);
})();

let addNewWord = async function (userID, word, translate, cb) {
  let query = `INSERT INTO ${DB_NAME} (userID, word, translate ) VALUES (?, ?, ?)`;
  return db.run(query, userID, word, translate, cb);
};

let deleteWord = async function (userID, id, cb) {
  let query = `DELETE FROM ${DB_NAME} WHERE id = ${id}`;
  return await db.run(query, cb);
};

let getAllWords = async function (userID) {
  let query = `SELECT * FROM ${DB_NAME} where userID = ${userID}`;
  return await db.all(query);
};

export { addNewWord, deleteWord, getAllWords };

// // addNewWord("1", "go", "идти", (err, result) => {
// //   console.log(result);
// // });

// setTimeout(async () => {
//   console.log(await getAllWords("1"));
// }, 100);
