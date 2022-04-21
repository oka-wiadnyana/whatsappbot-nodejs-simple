// inisisalisasi database
const mysql = require("mysql");
const db = mysql.createPool({
  // sesuaikan konfigurasi dengan server
  host: "localhost",
  user: "root",
  password: "",
  database: "sipp",
});

module.exports = db;
