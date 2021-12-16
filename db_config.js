// inisisalisasi database
const mysql = require("mysql");
const db = mysql.createPool({
  // sesuaikan konfigurasi dengan server
  host: "192.168.1.60",
  user: "kom_tengah",
  password: "hukum12345",
  database: "",
});

module.exports = db;
