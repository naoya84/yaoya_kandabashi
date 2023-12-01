/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('storage', function (table) {
    table.renameColumn('productShape', 'unit');
    table.renameColumn('piece', 'stock');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('storage', function (table) {
    table.renameColumn('unit', 'productShape');
    table.renameColumn('stock', 'piece');
  });
};
