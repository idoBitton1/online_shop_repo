import Pool from "pg";

const poolPg = new Pool.Pool({
    user: "postgres",
    password: "mpmpiv100",
    host: "localhost",
    port: 5432,
    database: "shift_manager"
});

//module.exports = poolPg;
export default poolPg;