// inisisalisasi database
const mysql = require("mysql");
const db = mysql.createConnection({
  // sesuaikan konfigurasi dengan server
  host: "localhost",
  user: "root",
  password: "",
  database: "",
});

module.exports = db;
