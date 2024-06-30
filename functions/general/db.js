const { Pool } = require("pg");

let { CONNECTION_STRING } = process.env;

const conn_db = new Pool({
  connectionString: CONNECTION_STRING,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const execute_query = async (text, params) => {
  const client = await conn_db.connect();
  const result = await conn_db.query(text, params);
  await console.log(result);
  await client.release();
  return result;
};

module.exports = {
  conn_db,
  execute_query,
};
