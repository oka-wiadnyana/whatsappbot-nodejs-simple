const db = require("./db_config");
const moment = require("moment");
//connect ke db
db.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});

const getData = (message) => {
  let keyword = message.split("#");
  return new Promise((resolve, reject) => {
    if (keyword[0] == "perkara") {
      let query = `SELECT *FROM daftar_perkara_tbl WHERE id='${keyword[1]}'`;

      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            responseMessage = `Percobaan Nomor perkara adalah ${result[0].nomor_perkara} atas nama ${result[0].pihak_1}`;
            3;
          } else {
            responseMessage = `Tidak ada data, mohon ditulis perintah yang benar, contoh perkara#123/pdt.g/2021/pn bli!`;
          }
          resolve(responseMessage);
        }
      });
    } else if (keyword[0] == "jadwal") {
      let query = `SELECT tanggal_sidang,agenda FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id WHERE nomor_perkara='${keyword[1]}'`;
      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let responseMessage;
          if (result.length != 0) {
            let resultArray = [];
            result.forEach((r) => {
              resultArray.push(
                `${moment(r.tanggal_sidang).format("D-M-YYYY")} : ${r.agenda}`
              );
            });
            responseMessage = resultArray.join("\n");
            3;
          } else {
            responseMessage = `Tidak ada data`;
          }
          resolve(responseMessage);
        }
      });
    }
  });
};

// getDataQuery("SELECT * FROM daftar_perkara_tbl WHERE id=43");

// const getData = (query) => {};

module.exports = getData;
