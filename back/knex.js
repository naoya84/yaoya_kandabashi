// const environment = "development";
// const config = require("./knexfile")[environment];
// const knex = require("knex")(config);

// module.exports = knex;

const config = require('./knexfile');
const knex = require('knex')(config);

module.exports = knex;
