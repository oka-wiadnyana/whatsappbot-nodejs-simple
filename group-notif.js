const moment = require("moment");
const db = require("./db_config");

const getDataPenahanan = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT
        tanggal_akhir,
        id,
        nomor_perkara,
        tanggal_putusan
      FROM
        (
          SELECT
            MAX(sampai) as tanggal_akhir,
            penahanan_terdakwa.perkara_id as id
          FROM
            penahanan_terdakwa
          GROUP BY
            penahanan_terdakwa.perkara_id
          ORDER BY
            penahanan_terdakwa.perkara_id DESC
        ) AS custom
        LEFT JOIN perkara ON custom.id = perkara.perkara_id
        LEFT JOIN perkara_putusan ON custom.id = perkara_putusan.perkara_id
      WHERE
        tanggal_akhir >= CURDATE()
        AND tanggal_akhir <= CURDATE() + 10
        AND tanggal_putusan IS NULL`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `Nomor perkara : ${
                r.nomor_perkara
              }, 'Tanggal penahanan terakhir : ${moment(r.tanggal_akhir).format(
                "D-M-YYYY"
              )}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataBA = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara,tanggal_sidang,agenda,panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE (alur_perkara_id=1 OR alur_perkara_id =2 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=118 OR alur_perkara_id=119 OR alur_perkara_id=120 OR alur_perkara_id=121) AND (YEAR(tanggal_sidang)=YEAR(NOW()) AND tanggal_sidang<=CURDATE()-1 AND edoc_bas IS NULL) ORDER BY tanggal_sidang DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal sidang : ${moment(
                r.tanggal_sidang
              ).format("D-M-YYYY")}, agenda : ${r.agenda}, pp : ${
                r.panitera_nama
              }`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataPutusanBelumMinut = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara,tanggal_putusan,panitera_nama FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_putusan IS NOT NULL AND tanggal_minutasi IS NULL ORDER BY tanggal_putusan DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.tanggal_putusan
              ).format("D-M-YYYY")}, pp : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataBelumBhtPidana = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, v_perkara_detil.tanggal_putusan,v_perkara_detil.tanggal_minutasi,panitera_nama FROM v_perkara_detil  LEFT JOIN perkara_putusan ON v_perkara_detil.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON v_perkara_detil.perkara_id=perkara_panitera_pn.perkara_id WHERE v_perkara_detil.tanggal_putusan IS NOT NULL AND v_perkara_detil.tanggal_minutasi IS NOT NULL AND perkara_putusan.tanggal_bht IS NULL AND permohonan_banding IS NULL AND permohonan_kasasi IS NULL AND YEAR(v_perkara_detil.tanggal_putusan)>=2019 AND (((alur_perkara_id = 111 OR alur_perkara_id = 112 OR alur_perkara_id = 118) AND v_perkara_detil.tanggal_minutasi <= CURDATE()-7)) ORDER BY tanggal_putusan DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.tanggal_putusan
              ).format("D-M-YYYY")}, tanggal minutasi : ${moment(
                r.tanggal_minutasi
              ).format("D-M-YYYY")}, pp : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataBelumBhtPerdata = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, v_perkara_detil.tanggal_putusan,v_perkara_detil.tanggal_minutasi,panitera_nama FROM v_perkara_detil  LEFT JOIN perkara_putusan ON v_perkara_detil.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON v_perkara_detil.perkara_id=perkara_panitera_pn.perkara_id WHERE v_perkara_detil.tanggal_putusan IS NOT NULL AND v_perkara_detil.tanggal_minutasi IS NOT NULL AND perkara_putusan.tanggal_bht IS NULL AND permohonan_banding IS NULL AND permohonan_kasasi IS NULL AND YEAR(v_perkara_detil.tanggal_putusan)>=2019  AND (((alur_perkara_id = 1 OR alur_perkara_id = 2 OR alur_perkara_id = 8) AND v_perkara_detil.tanggal_minutasi <= CURDATE()-14)) ORDER BY v_perkara_detil.tanggal_putusan DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.tanggal_putusan
              ).format("D-M-YYYY")}, tanggal minutasi : ${moment(
                r.tanggal_minutasi
              ).format("D-M-YYYY")}, pp : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataBelumSerahHukum = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id, perkara.nomor_perkara, tanggal_putusan, tanggal_bht FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN arsip ON perkara.perkara_id=arsip.perkara_id WHERE id IS NULL AND tanggal_bht IS NOT NULL AND YEAR(tanggal_bht) >=2019 ORDER BY tanggal_bht DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.tanggal_putusan
              ).format("D-M-YYYY")}, tanggal minutasi : ${moment(
                r.tanggal_minutasi
              ).format("D-M-YYYY")}, tanggal bht : ${moment(
                r.tanggal_bht
              ).format("D-M-YYYY")}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataTundaJadwalSidang = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT tanggal_terakhir, nomor_perkara, panitera_nama FROM (SELECT MAX(tanggal_sidang) AS tanggal_terakhir, perkara_id FROM perkara_jadwal_sidang GROUP BY perkara_id) as jadwal_sidang LEFT JOIN perkara ON jadwal_sidang.perkara_id=perkara.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_mediasi ON perkara.perkara_id=perkara_mediasi.perkara_id WHERE tanggal_putusan IS NULL AND (mediasi_id IS NULL OR keputusan_mediasi IS NOT NULL) AND tanggal_terakhir < CURDATE() ORDER BY tanggal_terakhir DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${
                r.nomor_perkara
              }, tanggal sidang terakhir : ${moment(r.tanggal_terakhir).format(
                "D-M-YYYY"
              )}, PP : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataSaksiTidakLengkap = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, panitera_nama FROM (SELECT DISTINCT(perkara_id) FROM perkara_jadwal_sidang WHERE agenda LIKE '%saksi%' AND dihadiri_oleh!=4 AND tanggal_sidang <= CURDATE()) as pemeriksaan_saksi LEFT JOIN perkara ON pemeriksaan_saksi.perkara_id=perkara.perkara_id LEFT JOIN perkara_pihak5 ON perkara.perkara_id=perkara_pihak5.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE perkara_pihak5.perkara_id IS NULL AND YEAR(perkara.tanggal_pendaftaran)>=2021 ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, PP : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataPutusanBelumBeritahu = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, tanggal_putusan, panitera_nama FROM perkara LEFT JOIN perkara_putusan_pemberitahuan_putusan ON perkara.perkara_id=perkara_putusan_pemberitahuan_putusan.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_putusan IS NOT NULL AND (alur_perkara_id=1 OR alur_perkara_id=2 OR alur_perkara_id=8 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=113 OR alur_perkara_id=118) AND perkara_putusan_pemberitahuan_putusan.perkara_id IS NULL  AND YEAR(tanggal_putusan)>='2019' ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.tanggal_putusan
              ).format("D-M-YYYY")}, PP : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataJadwalSidangPidana = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, agenda, panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_sidang = CURDATE() AND (alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=118) ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, agenda : ${r.agenda}, PP : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataJadwalSidangPerdata = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, agenda, panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_sidang = CURDATE() AND (alur_perkara_id=1 OR alur_perkara_id=2 OR alur_perkara_id=8) ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, agenda : ${r.agenda}, PP : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataJadwalMediasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, nama_mediator, panitera_nama FROM perkara LEFT JOIN perkara_mediasi ON perkara.perkara_id=perkara_mediasi.perkara_id  LEFT JOIN perkara_mediator ON perkara.perkara_id=perkara_mediator.perkara_id LEFT JOIN perkara_jadwal_mediasi ON perkara_mediasi.mediasi_id=perkara_jadwal_mediasi.mediasi_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_mediasi = CURDATE() ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, nama mediator : ${r.nama_mediator}, PP : ${r.panitera_nama}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataSisaPanjarPn = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, tanggal_putusan, sisa FROM v_perkara_biaya LEFT JOIN perkara_putusan ON v_perkara_biaya.perkara_id=perkara_putusan.perkara_id WHERE tahapan_terakhir_id=15 AND (alur_perkara_id = 1 OR alur_perkara_id = 2 OR alur_perkara_id = 8) AND sisa > 0 ORDER BY v_perkara_biaya.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.tanggal_putusan
              ).format("D-M-YYYY")}, sisa panjar : ${r.sisa.toLocaleString()}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataSisaPanjarBanding = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_banding, sisa FROM v_perkara_biaya_banding LEFT JOIN perkara_banding ON v_perkara_biaya_banding.perkara_id=perkara_banding.perkara_id WHERE proses_terakhir_id=400 AND (v_perkara_biaya_banding.alur_perkara_id = 1 OR v_perkara_biaya_banding.alur_perkara_id = 2 OR v_perkara_biaya_banding.alur_perkara_id = 8) AND sisa > 0 ORDER BY v_perkara_biaya_banding.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.putusan_banding
              ).format("D-M-YYYY")}, sisa panjar : ${r.sisa.toLocaleString()}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

const getDataSisaPanjarKasasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_kasasi, sisa FROM v_perkara_biaya_kasasi LEFT JOIN perkara_kasasi ON v_perkara_biaya_kasasi.perkara_id=perkara_kasasi.perkara_id WHERE proses_terakhir_id=500 AND (v_perkara_biaya_kasasi.alur_perkara_id = 1 OR v_perkara_biaya_kasasi.alur_perkara_id = 2 OR v_perkara_biaya_kasasi.alur_perkara_id = 8) AND sisa > 0 ORDER BY v_perkara_biaya_kasasi.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            resultArray.push(
              `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
                r.putusan_kasasi
              ).format("D-M-YYYY")}, sisa panjar : ${r.sisa.toLocaleString()}`
            );
          });
          responseMessage = resultArray.join("\n");
        } else {
          responseMessage = `Tidak ada data`;
        }
        resolve(responseMessage);
      }
    });
  });
};

// getDataSisaPanjarKasasi().then((res) => console.log(res));
module.exports = {
  getDataPenahanan,
  getDataBA,
  getDataPutusanBelumMinut,
  getDataBelumBhtPidana,
  getDataBelumBhtPerdata,
  getDataBelumSerahHukum,
  getDataTundaJadwalSidang,
  getDataSaksiTidakLengkap,
  getDataPutusanBelumBeritahu,
  getDataJadwalSidangPidana,
  getDataJadwalSidangPerdata,
  getDataJadwalMediasi,
  getDataSisaPanjarPn,
  getDataSisaPanjarBanding,
  getDataSisaPanjarKasasi,
};
