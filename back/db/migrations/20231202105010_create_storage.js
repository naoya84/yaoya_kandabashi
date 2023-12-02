/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('storage', function (table) {
		table.increments('id').primary();
		table.integer('storeId', 32);
		table.string('productName', 32);
		table.string('unit', 32);
		table.integer('stock', 32);
		table.integer('price', 32);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('storage');
};
