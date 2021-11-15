// inisisalisasi database
const mysql = require("mysql");
const db = mysql.createConnection({
  // sesuaikan konfigurasi dengan server
  host: "",
  user: "",
  password: "",
  database: "",
});

module.exports = db;
