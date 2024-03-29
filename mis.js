const mis = require("./group-notif");
const eis = require("./select");
const pengumuman = require("./pengumuman");

const misResponseMessage = async () => {
  try {
    let pengumumanMa = await pengumuman.getPengumumanMa();
    let pengumumanBadilum = await pengumuman.getPengumumanBadilum();
    let pengumumanPt = await pengumuman.getPengumumanPt();
    let eisBulanan = await eis.getSkorBulanan();
    let eisBulanLalu = await eis.getSkorBulanLalu();
    let eisTahunan = await eis.getDataTahunan();
    let eisTahunanKategori = await eis.getSkorTahunanKelas();
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
    let promiseDatabanding = mis.getDataBanding();
    let messageDataBanding = await promiseDatabanding;
    let promiseDataKasasi = mis.getDataKasasi();
    let messageDataKasasi = await promiseDataKasasi;
    let promiseDataPK = mis.getDataPK();
    let messageDataPK = await promiseDataPK;
    let promiseDataPetitum = mis.getDataEdocPetitum();
    let messageDataPetitum = await promiseDataPetitum;
    let promiseDataDakwaan = mis.getDataEdocDakwaan();
    let messageDataDakwaan = await promiseDataDakwaan;
    let promiseDataEdocAnonimisasi = mis.getDataEdocAnonimisasi();
    let messageDataAnonimisasi = await promiseDataEdocAnonimisasi;
    let promiseDataBelumDelegasi = mis.getDataBelumDelegasi();
    let messageDataBelumDelegasi = await promiseDataBelumDelegasi;

    let msg = `*Data dari pesan ini diambil dari database SIPP dan hanya sebagai pengingat. _Data perkara yang muncul tidak selalu karena belum diinput, namun juga  karena masih sedang dalam proses (dalam waktu yang masih dibenarkan)_*  \n\n*Pengumuman Mahkamah Agung* \n${pengumumanMa} \n\n*Pengumuman Badilum* \n${pengumumanBadilum} \n\n*Pengumuman PT Denpasar* \n${pengumumanPt} \n\n*Nilai Eis Tahun ini* : \n${eisTahunan} \n\n*Nilai Eis Tahun ini Kategori kelas II 501 ~ 1000 perkara* : \n${eisTahunanKategori} \n\n*Nilai Eis Bulan ini* : \n${eisBulanan} \n\n*Nilai Eis Bulan lalu* : \n${eisBulanLalu} \n\n*Statistik Penanganan Perkara Tahun ini (tidak termasuk perkara tilang)  :* \n${messageStatistik} \n\n*Data delegasi belum dilaksanakan* : \n${messageDataBelumDelegasi} \n\n*Data penahanan yang habis dalam 15 hari* : \n${messagePenahanan} \n\n*Data Putusan yang belum diminutasi* : \n${messagePutusanBelumMinut} \n\n*Data perkara pidana yang belum berisi tanggal BHT* : \n${messageBelumBhtPidana} \n\n*Data perkara perdata yang belum berisi tanggal BHT* : \n${messageBelumBhtPerdata} \n\n*Data perkara banding yang belum berisi tanggal BHT* : \n${messageBelumBhtBanding} \n\n*Data perkara kasasi yang belum berisi tanggal BHT* : \n${messageBelumBhtKasasi} \n\n*Data perkara yang data saksi tidak lengkap* : \n${messageSaksiTidakLengkap} \n\n*Data perkara sudah putus yang belum diberitahukan* : \n${messagePutusanBelumBeritahu} \n\n*Data banding belum dikirim* : \n${messageDataBanding} \n\n*Data kasasi belum dikirm* : \n${messageDataKasasi} \n\n*Data PK belum dikirim* : \n${messageDataPK}  \n\n*Perkara Perdata belum berisi Edoc Petitum* : \n${messageDataPetitum} \n\n*Perkara Pidana belum berisi Edoc Dakwaan* : \n${messageDataDakwaan} \n\n*Perkara Putusan Belum Anonimisasi* : \n${messageDataAnonimisasi} \n\n*Perkara yang belum dilakukan penundaan* : \n${messageTundaJadwalSidang} \n\n*Jadwal sidang pidana hari ini* : \n${messageJadwalSidangPidana} \n\n*Jadwal sidang perdata hari ini* : \n${messageJadwalSidangPerdata} \n\n*Jadwal mediasi hari ini* : \n${messageJadwalMediasi} \n\n*Panggilan belum dilaksanakan/Relas belum diupload* : \n${messageBelumPanggilan} \n\n*Sisa panjar perkara tingkat pertama yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarPn} \n\n*Sisa panjar perkara tingkat banding yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarBanding} \n\n*Sisa panjar perkara tingkat kasasi yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarKasasi} \n\n*Data perkara yang belum upload BA* : \n${messageBA} \n\n*Data perkara yang belum diserahkan ke bagian hukum* : \n${messageBelumSerahHukum} \n\n*Data perkara yang belum belum terdapat data court calendar sampai putusan/penetapan* : \n${messageDataCourtCalendar} \n\n*Edoc court calendar belum upload* : \n${messageBelumEdocCC}`;
    return msg;
  } catch (error) {
    console.log(error);
  }
};

module.exports = misResponseMessage;
