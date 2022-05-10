// inisisalisasi database
const mysql = require("mysql");
const db = mysql.createPool({
  // sesuaikan konfigurasi dengan server
  host: "192.168.50.50",
  user: "pdt",
  password: "12345",
  database: "sipp_clone",
});

module.exports = db;
