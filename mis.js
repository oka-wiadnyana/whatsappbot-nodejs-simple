const mis = require("./group-notif");

const misResponseMessage = async () => {
  try {
    let promisePenahanan = mis.getDataPenahanan();
    let messagePenahanan = await promisePenahanan;
    let promiseBA = mis.getDataBA();
    let messageBA = await promiseBA;
    let promisePutusanBelumMinut = mis.getDataPutusanBelumMinut();
    let messagePutusanBelumMinut = await promisePutusanBelumMinut;
    let promiseBelumBhtPidana = mis.getDataBelumBhtPidana();
    let messageBelumBhtPidana = await promiseBelumBhtPidana;
    let promiseBelumBhtPerdata = mis.getDataBelumBhtPerdata();
    let messageBelumBhtPerdata = await promiseBelumBhtPerdata;
    let promiseBelumSerahHukum = mis.getDataBelumSerahHukum();
    let messageBelumSerahHukum = await promiseBelumSerahHukum;
    let promiseTundaJadwalSidang = mis.getDataTundaJadwalSidang();
    let messageTundaJadwalSidang = await promiseTundaJadwalSidang;
    let promiseSaksiTidakLengkap = mis.getDataSaksiTidakLengkap();
    let messageSaksiTidakLengkap = await promiseSaksiTidakLengkap;
    let promisePutusanBelumBeritahu = mis.getDataPutusanBelumBeritahuNew();
    let messagePutusanBelumBeritahu = await promisePutusanBelumBeritahu;
    let promiseJadwalSidangPidana = mis.getDataJadwalSidangPidana();
    let messageJadwalSidangPidana = await promiseJadwalSidangPidana;
    let promiseJadwalSidangPerdata = mis.getDataJadwalSidangPerdata();
    let messageJadwalSidangPerdata = await promiseJadwalSidangPerdata;
    let promiseJadwalMediasi = mis.getDataJadwalMediasi();
    let messageJadwalMediasi = await promiseJadwalMediasi;
    let promiseSisaPanjarPn = mis.getDataSisaPanjarPn();
    let messageSisaPanjarPn = await promiseSisaPanjarPn;
    let promiseSisaPanjarBanding = mis.getDataSisaPanjarBanding();
    let messageSisaPanjarBanding = await promiseSisaPanjarBanding;
    let promiseSisaPanjarKasasi = mis.getDataSisaPanjarKasasi();
    let messageSisaPanjarKasasi = await promiseSisaPanjarKasasi;
    let promiseDataCourtCalendar = mis.getDataCourtCalendar();
    let messageDataCourtCalendar = await promiseDataCourtCalendar;
    let promiseStatistik = mis.getStatistik();
    let messageStatistik = await promiseStatistik;
    let promiseBelumBhtBanding = mis.getBelumBhtBanding();
    let messageBelumBhtBanding = await promiseBelumBhtBanding;
    let promiseBelumBhtKasasi = mis.getBelumBhtKasasi();
    let messageBelumBhtKasasi = await promiseBelumBhtKasasi;
    let promiseBelumPanggilan = mis.getBelumPanggilan();
    let messageBelumPanggilan = await promiseBelumPanggilan;
    let promiseBelumEdocCC = mis.getBelumEdocCourtCalendar();
    let messageBelumEdocCC = await promiseBelumEdocCC;

    let msg = `*Data dari pesan ini diambil dari database SIPP dan hanya sebagai pengingat. _Data perkara yang muncul tidak selalu karena belum diinput, namun juga  karena masih sedang dalam proses (dalam waktu yang masih dibenarkan)_* \n\n*Statistik Penanganan Perkara Tahun ini (tidak termasuk perkara tilang)  :* \n${messageStatistik} \n\n*Data penahanan yang habis dalam 10 hari* : \n${messagePenahanan} \n\n*Data Putusan yang belum diminutasi* : \n${messagePutusanBelumMinut} \n\n*Data perkara pidana yang belum berisi tanggal BHT* : \n${messageBelumBhtPidana} \n\n*Data perkara perdata yang belum berisi tanggal BHT* : \n${messageBelumBhtPerdata} \n\n*Data perkara banding yang belum berisi tanggal BHT* : \n${messageBelumBhtBanding} \n\n*Data perkara kasasi yang belum berisi tanggal BHT* : \n${messageBelumBhtKasasi} \n\n*Data perkara yang belum dilakukan penundaan* : \n${messageTundaJadwalSidang} \n\n*Data perkara yang data saksi tidak lengkap* : \n${messageSaksiTidakLengkap} \n\n*Data perkara sudah putus yang belum diberitahukan* : \n${messagePutusanBelumBeritahu} \n\n*Jadwal sidang pidana hari ini* : \n${messageJadwalSidangPidana} \n\n*Jadwal sidang perdata hari ini* : \n${messageJadwalSidangPerdata} \n\n*Jadwal mediasi hari ini* : \n${messageJadwalMediasi} \n\n*Sisa panjar perkara tingkat pertama yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarPn} \n\n*Panggilan belum dilaksanakan/Relas belum diupload* : \n${messageBelumPanggilan} \n\n*Sisa panjar perkara tingkat banding yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarBanding} \n\n*Sisa panjar perkara tingkat kasasi yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarKasasi} \n\n*Data perkara yang belum upload BA* : \n${messageBA} \n\n*Data perkara yang belum diserahkan ke bagian hukum* : \n${messageBelumSerahHukum} \n\n*Data perkara yang belum belum terdapat data court calendar sampai putusan/penetapan* : \n${messageDataCourtCalendar}  \n\n*Edoc court calendar belum upload* : \n${messageBelumEdocCC}`;
    // let msg = `*Data dari pesan ini diambil dari database SIPP dan hanya sebagai pengingat. _Data perkara yang muncul tidak selalu karena belum diinput, namun juga  karena masih sedang dalam proses (dalam waktu yang masih dibenarkan)_* \n\n*Statistik Penanganan Perkara Tahun ini (tidak termasuk perkara tilang)  :* \n${messageStatistik} \n\n*Data penahanan yang habis dalam 10 hari* : \n${messagePenahanan} \n\n*Data Putusan yang belum diminutasi* : \n${messagePutusanBelumMinut} \n\n*Data perkara pidana yang belum berisi tanggal BHT* : \n${messageBelumBhtPidana} \n\n*Data perkara perdata yang belum berisi tanggal BHT* : \n${messageBelumBhtPerdata} \n\n*Data perkara banding yang belum berisi tanggal BHT* : \n${messageBelumBhtBanding} \n\n*Data perkara kasasi yang belum berisi tanggal BHT* : \n${messageBelumBhtKasasi} \n\n*Data perkara yang belum dilakukan penundaan* : \n${messageTundaJadwalSidang} \n\n*Data perkara yang data saksi tidak lengkap* : \n${messageSaksiTidakLengkap} \n\n*Data perkara sudah putus yang belum diberitahukan* : \n${messagePutusanBelumBeritahu} \n\n*Jadwal sidang pidana hari ini* : \n${messageJadwalSidangPidana} \n\n*Jadwal sidang perdata hari ini* : \n${messageJadwalSidangPerdata} \n\n*Jadwal mediasi hari ini* : \n${messageJadwalMediasi} \n\n*Sisa panjar perkara tingkat pertama yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarPn} \n\n*Panggilan belum dilaksanakan/Relas belum diupload* : \n${messageBelumPanggilan} \n\n*Sisa panjar perkara tingkat banding yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarBanding} \n\n*Sisa panjar perkara tingkat kasasi yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarKasasi} \n\n*Data perkara yang belum upload BA* : \n${messageBA} \n\n*Data perkara yang belum diserahkan ke bagian hukum* : \n${messageBelumSerahHukum} \n\n*Data perkara yang belum belum terdapat data court calendar sampai putusan/penetapan* : \n${messageDataCourtCalendar} `;
    return msg;
  } catch (error) {
    console.log(error);
  }
};

module.exports = misResponseMessage;
