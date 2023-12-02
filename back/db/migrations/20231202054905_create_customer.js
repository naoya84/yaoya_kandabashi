/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("customer", function (table) {
      table.increments("id").primary();
      table.string("name");
      table.string("salt", 8);
      table.string("hash", 64);
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable("customer");
  };
  