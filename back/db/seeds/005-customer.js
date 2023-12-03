/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const crypto = require("crypto");

// 何も変換していないパスワード
const pass = "pass";

// saltの作成
const salt1 = crypto.randomBytes(6).toString("hex");
const salt2 = crypto.randomBytes(6).toString("hex");
const salt3 = crypto.randomBytes(6).toString("hex");

// hashed_passの作成
// saltをパスワードに付け加える
const saltAndPass1 = salt1 + pass;
// console.log("saltAndPass1", saltAndPass1);
const saltAndPass2 = salt2 + pass;
const saltAndPass3 = salt3 + pass;

// sha256を使ってハッシュ・オブジェクトを作る
const hash1 = crypto.createHash("sha256");
const hash2 = crypto.createHash("sha256");
const hash3 = crypto.createHash("sha256");
// 上で作ったハッシュ値で更新して、最後にdigestで取り出す
const hashedPassword1 = hash1.update(saltAndPass1).digest("hex");
const hashedPassword2 = hash2.update(saltAndPass2).digest("hex");
const hashedPassword3 = hash3.update(saltAndPass3).digest("hex");
console.log("saltAndPass1", saltAndPass1);

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("customer").insert([
    { id: 1, user_name: "maya", salt: salt1, hashed_pass: hashedPassword1 },
    { id: 2, user_name: "tatsu", salt: salt2, hashed_pass: hashedPassword2 },
    {
      id: 3,
      user_name: "rowValue3",
      salt: salt3,
      hashed_pass: hashedPassword3,
    },
  ]);
};
