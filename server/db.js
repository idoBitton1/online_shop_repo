const Pool = require("pg").Pool;

const poolPg = new Pool({
    user: "postgres",
    password: "mpmpiv100",
    host: "localhost",
    port: 5432,
    database: "shift_manager"
});

module.exports = poolPg;