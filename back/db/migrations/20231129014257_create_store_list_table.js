/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('store_list', function (table) {
    table.integer('id', 32).primary();
    table.string('storeName', 32);
    table.decimal('northLatitude', 32, 4);
    table.decimal('eastLongitude', 32, 4);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('store_list');
};
