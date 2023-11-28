/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("test", function (table) {
    table.increments("id").primary(); // Set this column as the primary key
    table.string("fist_name", 32).notNullable();
    table.string("last_name", 32).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("test");
};
