/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("shopping_list", function (table) {
    table.integer("id", 32).primary();
    table.integer("userId", 32);
    table.integer("storeId", 32);
    table.string("productName", 32);
    table.integer("piece", 32);
    table.boolean("flag");
    table.timestamp("time");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("shopping_list");
};
