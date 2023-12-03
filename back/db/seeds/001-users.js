const crypto = require('crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	// await knex('table_name').del()
	await knex('users').del();

	const users = ['admin', '高橋ジョージ', 'tatsu', 'taro', 'jiro', 'sabro'];
	for (const name of users) {
		const salt = crypto.randomBytes(6).toString('hex');
		const saltAndPass = `${salt}${name}`;
		const hashedPass = crypto.createHash('sha256').update(saltAndPass).digest('hex');
		await knex('users').insert({ username: name, salt: salt, hashedPass: hashedPass });
	}
};
