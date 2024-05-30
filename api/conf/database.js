
var mysql = require('mysql2');

// create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    connectionLimit: 20,
    queueLimit: 10
}).promise();

module.exports = pool;
