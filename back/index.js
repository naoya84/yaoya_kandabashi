const express = require("express");
const app = express();
const knex = require("./knex");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ひとまずchromeへの表示完了");
});

// app.get("/", async (req, res) => {
//   const user = await knex
//     .select()
//     .from("game")
//     .then((data) => {
//       return data;
//     })
//     .then((data) => {
//       res.send(data); //dataは配列
//     });
// });

app.listen(4242, () => {
  console.log("server on PORT4242");
});
