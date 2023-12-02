/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('shopping_list', function (table) {
		table.increments('id').primary();
		table.integer('userId', 32);
		table.integer('storeId', 32);
		table.string('productName', 32);
		table.string('unit', 32);
		table.integer('quantity', 32);
		table.boolean('flag');
		table.timestamp('time');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('shopping_list');
};
