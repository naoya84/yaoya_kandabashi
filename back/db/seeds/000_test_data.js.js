/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

"use strict";

// exports.seed = function (knex, Promise) {
//   // Deletes ALL existing entries
//   knex("game").insert({ id: 1, first_name: "tomohiro", last_name: "Jin" });
// };

exports.seed = function (knex, Promise) {
  const datas = [
    {
      id: 1,
      fist_name: "Tomohiro",
      last_name: "Jin",
    },
    {
      id: 2,
      fist_name: "Hui",
      last_name: "Wang",
    },
  ];
  return knex("game")
    .del()
    .then(() => {
      return knex("game").insert(datas);
    });
};
