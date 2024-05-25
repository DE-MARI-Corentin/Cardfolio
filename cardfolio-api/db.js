// db.js
const mysql = require('mysql2/promise');


const connection = mysql.createPool({
  host: '192.168.1.155',
  port: '3310',
  user: 'svc-development',
  password: 'R?9jrdJyNhP8egDF',
  database: 'cardfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = connection;
