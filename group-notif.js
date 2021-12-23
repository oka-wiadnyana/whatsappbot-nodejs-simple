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
        AND tanggal_akhir <= DATE_ADD(CURDATE(),INTERVAL 10 DAY)
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
    let query = `SELECT nomor_perkara,tanggal_sidang,agenda,panitera_nama FROM perkara LEFT JOIN perkara_jadwal_sidang ON perkara.perkara_id=perkara_jadwal_sidang.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE (alur_perkara_id=1 OR alur_perkara_id =2 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=118 OR alur_perkara_id=119 OR alur_perkara_id=120 OR alur_perkara_id=121) AND (YEAR(tanggal_sidang)=YEAR(NOW()) AND tanggal_sidang < CURDATE() AND edoc_bas IS NULL) ORDER BY tanggal_sidang DESC`;

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
    let query = `SELECT nomor_perkara, v_perkara_detil.tanggal_putusan,v_perkara_detil.tanggal_minutasi,panitera_nama FROM v_perkara_detil  LEFT JOIN perkara_putusan ON v_perkara_detil.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON v_perkara_detil.perkara_id=perkara_panitera_pn.perkara_id WHERE v_perkara_detil.tanggal_putusan IS NOT NULL AND v_perkara_detil.tanggal_minutasi IS NOT NULL AND perkara_putusan.tanggal_bht IS NULL AND permohonan_banding IS NULL AND permohonan_kasasi IS NULL AND YEAR(v_perkara_detil.tanggal_putusan)>=2019 AND (((alur_perkara_id = 111 OR alur_perkara_id = 112 OR alur_perkara_id = 113 OR alur_perkara_id = 118) AND v_perkara_detil.tanggal_minutasi <= CURDATE())) ORDER BY tanggal_putusan DESC`;

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
    let query = `SELECT nomor_perkara, v_perkara_detil.tanggal_putusan,v_perkara_detil.tanggal_minutasi,panitera_nama FROM v_perkara_detil  LEFT JOIN perkara_putusan ON v_perkara_detil.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON v_perkara_detil.perkara_id=perkara_panitera_pn.perkara_id WHERE v_perkara_detil.tanggal_putusan IS NOT NULL AND v_perkara_detil.tanggal_minutasi IS NOT NULL AND perkara_putusan.tanggal_bht IS NULL AND permohonan_banding IS NULL AND permohonan_kasasi IS NULL AND YEAR(v_perkara_detil.tanggal_putusan)>=2019  AND (((alur_perkara_id = 1 OR alur_perkara_id = 2 OR alur_perkara_id = 8) AND v_perkara_detil.tanggal_minutasi <= CURDATE())) ORDER BY v_perkara_detil.tanggal_putusan DESC`;

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
    let query = `SELECT id, perkara.nomor_perkara, tanggal_putusan, tanggal_minutasi, tanggal_bht FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN arsip ON perkara.perkara_id=arsip.perkara_id WHERE id IS NULL AND tanggal_bht IS NOT NULL AND YEAR(tanggal_bht) >=2019 ORDER BY tanggal_bht DESC`;

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
    let query = `SELECT tanggal_terakhir, nomor_perkara, panitera_nama FROM (SELECT MAX(tanggal_sidang) AS tanggal_terakhir, perkara_id FROM perkara_jadwal_sidang GROUP BY perkara_id) as jadwal_sidang LEFT JOIN perkara ON jadwal_sidang.perkara_id=perkara.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_mediasi ON perkara.perkara_id=perkara_mediasi.perkara_id WHERE tanggal_putusan IS NULL AND (mediasi_id IS NULL OR keputusan_mediasi IS NOT NULL) AND tanggal_terakhir <= CURDATE() ORDER BY tanggal_terakhir DESC`;

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

// const getDataPutusanBelumBeritahu = () => {
//   return new Promise((resolve, reject) => {
//     let query = `SELECT nomor_perkara, tanggal_putusan, panitera_nama FROM perkara LEFT JOIN perkara_putusan_pemberitahuan_putusan ON perkara.perkara_id=perkara_putusan_pemberitahuan_putusan.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN perkara_panitera_pn ON perkara.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_putusan IS NOT NULL AND (alur_perkara_id=1 OR alur_perkara_id=2 OR alur_perkara_id=8 OR alur_perkara_id=111 OR alur_perkara_id=112 OR alur_perkara_id=113 OR alur_perkara_id=118) AND perkara_putusan_pemberitahuan_putusan.perkara_id IS NULL  AND YEAR(tanggal_putusan)>='2019' ORDER BY perkara.perkara_id DESC`;

//     db.query(query, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         let responseMessage;
//         if (result.length != 0) {
//           let resultArray = [];
//           result.forEach((r) => {
//             resultArray.push(
//               `No Perkara : ${r.nomor_perkara}, tanggal putusan : ${moment(
//                 r.tanggal_putusan
//               ).format("D-M-YYYY")}, PP : ${r.panitera_nama}`
//             );
//           });
//           responseMessage = resultArray.join("\n");
//         } else {
//           responseMessage = `Tidak ada data`;
//         }
//         resolve(responseMessage);
//       }
//     });
//   });
// };

const getDataPutusanBelumBeritahuNew = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT perkara.perkara_id, alur_perkara_id,nomor_perkara, nama, pihak,perkara_putusan_pemberitahuan_putusan.pihak_id as pihak_pemb, tanggal_pemberitahuan_putusan, tanggal_putusan FROM perkara LEFT JOIN perkara_putusan_pemberitahuan_putusan ON perkara.perkara_id=perkara_putusan_pemberitahuan_putusan.perkara_id LEFT JOIN perkara_putusan ON perkara.perkara_id=perkara_putusan.perkara_id LEFT JOIN pihak ON perkara_putusan_pemberitahuan_putusan.pihak_id=pihak.id WHERE alur_perkara_id !=114 AND tanggal_putusan is not null AND year(tanggal_putusan) > 2020 AND tanggal_pemberitahuan_putusan is null ORDER BY perkara.perkara_id DESC`;

    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        let responseMessage;
        if (result.length != 0) {
          let resultArray = [];
          result.forEach((r) => {
            let pihak_jenis;
            if (r.alur_perkara_id == 1 || r.alur_perkara_id == 8) {
              pihak_jenis = r.pihak == 1 ? "Penggugat" : "Tergugat";
              resultArray.push(
                `No Perkara : ${r.nomor_perkara},  tanggal putusan : ${moment(
                  r.tanggal_putusan
                ).format(
                  "D-M-YYYY"
                )}, pihak yang belum diberitahukan : ${pihak_jenis}`
              );
            } else if (
              r.alur_perkara_id == 111 ||
              r.alur_perkara_id == 112 ||
              r.alur_perkara_id == 113 ||
              r.alur_perkara_id == 118
            ) {
              pihak_jenis = r.pihak == 1 ? "Penuntut Umum" : "Terdakwa";
              resultArray.push(
                `No Perkara : ${r.nomor_perkara},  pihak yang belum diberitahukan : ${pihak_jenis}`
              );
            } else {
              pihak_jenis = "Pemohon";
              resultArray.push(
                `No Perkara : ${r.nomor_perkara},  pihak yang belum diberitahukan : ${pihak_jenis}`
              );
            }
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

const getDataCourtCalendar = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT rencana_agenda, nomor_perkara, rencana_tanggal, panitera_nama FROM (SELECT MAX(id) AS id_cc, perkara_id FROM perkara_court_calendar GROUP BY perkara_id ORDER BY perkara_id DESC) AS court_calendar LEFT JOIN perkara ON court_calendar.perkara_id=perkara.perkara_id LEFT JOIN perkara_court_calendar ON   court_calendar.id_cc = perkara_court_calendar.id LEFT JOIN perkara_putusan ON court_calendar.perkara_id = perkara_putusan.perkara_id LEFT JOIN perkara_mediasi ON court_calendar.perkara_id=perkara_mediasi.perkara_id LEFT JOIN perkara_panitera_pn ON court_calendar.perkara_id=perkara_panitera_pn.perkara_id WHERE tanggal_putusan IS NULL AND (rencana_agenda NOT LIKE '%putusan%' AND rencana_agenda NOT LIKE '%penetapan%') AND (mediasi_id IS NULL OR keputusan_mediasi IS NOT NULL) ORDER BY court_calendar.perkara_id DESC`;

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

const getStatistik = async () => {
  let querySisaTahunLalu = `SELECT COUNT(perkara.perkara_id) as jumlah_sisa FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 and YEAR(tanggal_pendaftaran) < YEAR(CURDATE()) AND (tanggal_putusan IS NULL OR YEAR(tanggal_putusan) = YEAR(CURDATE()))`;
  let queryMasukTahunIni = `SELECT COUNT(perkara.perkara_id) as jumlah_masuk FROM perkara LEFT JOIN       perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 and YEAR(tanggal_pendaftaran) = YEAR(CURDATE()) `;
  let queryPutusTahunIni = `SELECT COUNT(perkara.perkara_id) as jumlah_putus FROM perkara LEFT JOIN perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id WHERE alur_perkara_id != 114 AND YEAR(tanggal_putusan) = YEAR(CURDATE()) AND tanggal_putusan IS NOT NULL`;

  let jmlSisaTahunLalu = () => {
    return new Promise((resolve, reject) => {
      db.query(querySisaTahunLalu, async (err, result) => {
        if (err) {
          reject(err);
        } else {
          let jml = result;
          resolve(jml);
        }
      });
    });
  };

  let jmlMasukTahunIni = () => {
    return new Promise((resolve, reject) => {
      db.query(queryMasukTahunIni, async (err, result) => {
        if (err) {
          reject(err);
        } else {
          let jml = result;
          resolve(jml);
        }
      });
    });
  };

  let jmlPutusTahunIni = () => {
    return new Promise((resolve, reject) => {
      db.query(queryPutusTahunIni, async (err, result) => {
        if (err) {
          reject(err);
        } else {
          let jml = result;
          resolve(jml);
        }
      });
    });
  };

  let sisaTahunLalu = jmlSisaTahunLalu();
  let numberSisaTahunLalu = await sisaTahunLalu;
  let masukTahunIni = jmlMasukTahunIni();
  let numberMasukTahunIni = await masukTahunIni;
  let putusTahunIni = jmlPutusTahunIni();
  let numberPutusTahunIni = await putusTahunIni;
  let sisaTahunIni =
    numberSisaTahunLalu[0].jumlah_sisa +
    numberMasukTahunIni[0].jumlah_masuk -
    numberPutusTahunIni[0].jumlah_putus;
  let rasioPerkara =
    (numberPutusTahunIni[0].jumlah_putus /
      (numberSisaTahunLalu[0].jumlah_sisa +
        numberMasukTahunIni[0].jumlah_masuk)) *
    100;

  let rasioDisplay = rasioPerkara.toFixed(2);

  let message = `Jumlah sisa tahun lalu : ${numberSisaTahunLalu[0].jumlah_sisa}, \nJumlah masuk tahun ini : ${numberMasukTahunIni[0].jumlah_masuk} \nJumlah putus tahun ini : ${numberPutusTahunIni[0].jumlah_putus} \nSisa Tahun ini : ${sisaTahunIni} \n*Rasio Penanganan Perkara Tahun Ini : ${rasioDisplay}%*`;

  return message;
};

const getBelumBhtBanding = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_banding, pemberitahuan_putusan_banding from v_perkara_detil join perkara_putusan on v_perkara_detil.perkara_id=perkara_putusan.perkara_id where pemberitahuan_putusan_banding IS NOT NULL AND tanggal_bht is null and permohonan_kasasi IS NULL AND year(pemberitahuan_putusan_banding)>=2021`;

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
              }, tanggal putusan banding : ${moment(r.putusan_banding).format(
                "D-M-YYY"
              )}, tanggal pemberitahuan putusan banding : ${moment(
                r.pemberitahuan_putusan_banding
              ).format("D-M-YYY")}`
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

const getBelumBhtKasasi = () => {
  return new Promise((resolve, reject) => {
    let query = `SELECT nomor_perkara, putusan_kasasi, pemberitahuan_putusan_kasasi from v_perkara_detil join perkara_putusan on v_perkara_detil.perkara_id=perkara_putusan.perkara_id where pemberitahuan_putusan_kasasi IS NOT NULL AND tanggal_bht is null AND year(pemberitahuan_putusan_kasasi)>=2021`;

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
              }, tanggal putusan kasasi : ${moment(r.putusan_kasasi).format(
                "D-M-YYYY"
              )}, tanggal pemberitahuan putusan kasasi : ${moment(
                r.pemberitahuan_putusan_kasasi
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

// getDataPutusanBelumBeritahuNew().then((res) => console.log(res));
module.exports = {
  getDataPenahanan,
  getDataBA,
  getDataPutusanBelumMinut,
  getDataBelumBhtPidana,
  getDataBelumBhtPerdata,
  getDataBelumSerahHukum,
  getDataTundaJadwalSidang,
  getDataSaksiTidakLengkap,
  getDataPutusanBelumBeritahuNew,
  getDataJadwalSidangPidana,
  getDataJadwalSidangPerdata,
  getDataJadwalMediasi,
  getDataSisaPanjarPn,
  getDataSisaPanjarBanding,
  getDataSisaPanjarKasasi,
  getDataCourtCalendar,
  getStatistik,
  getBelumBhtBanding,
  getBelumBhtKasasi,
};
