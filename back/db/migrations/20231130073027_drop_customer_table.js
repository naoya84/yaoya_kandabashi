/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.dropTable("customer");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.createTable("customer", function (table) {
    table.integer("id", 32).primary();
    table.string("name");
    table.string("salt", 8);
    table.string("hash", 64);
  });
};
