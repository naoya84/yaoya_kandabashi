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
    table.string("user_name", 32).notNullable();
    table.string("password", 32).notNullable().defaultTo("pass");
  });
};
