/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("customer").insert([
    // { id: 1, user_name: "高橋ジョージ" },
    // { id: 2, user_name: "tatsu" },
    // { id: 3, user_name: "rowValue3" },
    { user_name: "maya" },
    { user_name: "tatsu" },
    { user_name: "rowValue3" },
  ]);
};
