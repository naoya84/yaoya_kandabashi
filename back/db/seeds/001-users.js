const crypto = require('crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
	// Deletes ALL existing entries
	// await knex('table_name').del()
	const users = ['admin', '高橋ジョージ', 'tatsu', 'taro', 'jiro', 'sabro'];
	for (const username of users) {
		const exists = await knex('users').where({ username }).first();
		if (!exists) {
			const salt = crypto.randomBytes(6).toString('hex');
			const saltAndPass = `${salt}${username}`;
			const hashedPass = crypto.createHash('sha256').update(saltAndPass).digest('hex');
			await knex('users').insert({ username: username, salt: salt, hashedPass: hashedPass });
		}
	}
};
