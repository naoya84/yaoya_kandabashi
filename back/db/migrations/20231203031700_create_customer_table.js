/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("customer", function (table) {
    table.integer("id", 32).primary();
    table.string("user_name", 32).notNullable();
    table.string("salt", 32).notNullable();
    table.string("hashed_pass", 100).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("customer");
};
