/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("storage", function (table) {
    table.integer("id", 32).primary();
    table.integer("storeId", 32);
    table.string("productName", 32);
    table.string("productShape", 32);
    table.integer("piece", 32);
    table.integer("price", 32);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("storage");
};
