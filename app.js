const fs = require("fs");
const { Client, Location, List, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const figlet = require("figlet");
const cron = require("node-cron");
const getData = require("./query");
const groupNotif = require("./group-notif");
const express = require("express");
const app = express();
const port = 3000;

// console log bot name
figlet("OKABOT", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

// use this code for post request
app.use(express.urlencoded({ extended: true }));

//cari session agar tidak scan qr
const SESSION_FILE_PATH = "./session.json";
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

//inisiasi whatsapp
const client = new Client({
  puppeteer: { headless: false },
  session: sessionCfg,
  qrTimeoutMs: 0,
});
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

// You also could connect to an existing instance of a browser
// {
//    puppeteer: {
//        browserWSEndpoint: `ws://localhost:3000`
//    }
// }

client.initialize();

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  // console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  //saat diotentifikasi
  // console.log("AUTHENTICATED", session);
  console.log("AUTHENTICATED");
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  //saat wa sudah siap
  console.log("READY");
});

// first notif function
const sendGroupFirst = async () => {
  try {
    let promisePenahanan = groupNotif.getDataPenahanan();
    let messagePenahanan = await promisePenahanan;
    let promiseBA = groupNotif.getDataBA();
    let messageBA = await promiseBA;
    let promisePutusanBelumMinut = groupNotif.getDataPutusanBelumMinut();
    let messagePutusanBelumMinut = await promisePutusanBelumMinut;
    let promiseBelumBhtPidana = groupNotif.getDataBelumBhtPidana();
    let messageBelumBhtPidana = await promiseBelumBhtPidana;
    let promiseBelumBhtPerdata = groupNotif.getDataBelumBhtPerdata();
    let messageBelumBhtPerdata = await promiseBelumBhtPerdata;
    let promiseBelumSerahHukum = groupNotif.getDataBelumSerahHukum();
    let messageBelumSerahHukum = await promiseBelumSerahHukum;
    let promiseTundaJadwalSidang = groupNotif.getDataTundaJadwalSidang();
    let messageTundaJadwalSidang = await promiseTundaJadwalSidang;
    let promiseSaksiTidakLengkap = groupNotif.getDataSaksiTidakLengkap();
    let messageSaksiTidakLengkap = await promiseSaksiTidakLengkap;
    let promisePutusanBelumBeritahu = groupNotif.getDataPutusanBelumBeritahu();
    let messagePutusanBelumBeritahu = await promisePutusanBelumBeritahu;
    let promiseJadwalSidangPidana = groupNotif.getDataJadwalSidangPidana();
    let messageJadwalSidangPidana = await promiseJadwalSidangPidana;
    let promiseJadwalSidangPerdata = groupNotif.getDataJadwalSidangPerdata();
    let messageJadwalSidangPerdata = await promiseJadwalSidangPerdata;
    let promiseJadwalMediasi = groupNotif.getDataJadwalMediasi();
    let messageJadwalMediasi = await promiseJadwalMediasi;
    let promiseSisaPanjarPn = groupNotif.getDataSisaPanjarPn();
    let messageSisaPanjarPn = await promiseSisaPanjarPn;
    let promiseSisaPanjarBanding = groupNotif.getDataSisaPanjarBanding();
    let messageSisaPanjarBanding = await promiseSisaPanjarBanding;
    let promiseSisaPanjarKasasi = groupNotif.getDataSisaPanjarKasasi();
    let messageSisaPanjarKasasi = await promiseSisaPanjarKasasi;
    let promiseDataCourtCalendar = groupNotif.getDataCourtCalendar();
    let messageDataCourtCalendar = await promiseDataCourtCalendar;
    let promiseStatistik = groupNotif.getStatistik();
    let messageStatistik = await promiseStatistik;
    let promiseBelumBhtBanding = groupNotif.getBelumBhtBanding();
    let messageBelumBhtBanding = await promiseBelumBhtBanding;
    let promiseBelumBhtKasasi = groupNotif.getBelumBhtKasasi();
    let messageBelumBhtKasasi = await promiseBelumBhtKasasi;

    let msg = `*Data dari pesan ini diambil dari database SIPP dan hanya sebagai pengingat. _Data perkara yang muncul tidak selalu karena belum diinput, namun juga  karena masih sedang dalam proses (dalam waktu yang masih dibenarkan)_* \n\n*Statistik Penanganan Perkara Tahun ini (tidak termasuk perkara tilang)  :* \n${messageStatistik} \n\n*Data penahanan yang habis dalam 10 hari* : \n${messagePenahanan} \n\n*Data Putusan yang belum diminutasi* : \n${messagePutusanBelumMinut} \n\n*Data perkara pidana yang belum berisi tanggal BHT* : \n${messageBelumBhtPidana} \n\n*Data perkara perdata yang belum berisi tanggal BHT* : \n${messageBelumBhtPerdata} \n\n*Data perkara banding yang belum berisi tanggal BHT* : \n${messageBelumBhtBanding} \n\n*Data perkara kasasi yang belum berisi tanggal BHT* : \n${messageBelumBhtKasasi} \n\n*Data perkara yang data saksi tidak lengkap* : \n${messageSaksiTidakLengkap} \n\n*Data perkara sudah putus yang belum diberitahukan* : \n${messagePutusanBelumBeritahu} \n\n*Jadwal sidang pidana hari ini* : \n${messageJadwalSidangPidana} \n\n*Jadwal sidang perdata hari ini* : \n${messageJadwalSidangPerdata} \n\n*Jadwal mediasi hari ini* : \n${messageJadwalMediasi} \n\n*Sisa panjar perkara tingkat pertama yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarPn} \n\n*Sisa panjar perkara tingkat banding yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarBanding} \n\n*Sisa panjar perkara tingkat kasasi yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarKasasi} \n\n*Data perkara yang belum upload BA* : \n${messageBA} \n\n*Data perkara yang belum diserahkan ke bagian hukum* : \n${messageBelumSerahHukum} \n\n*Data perkara yang belum belum terdapat data court calendar sampai putusan/penetapan* : \n${messageDataCourtCalendar}`;
    return msg;
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("15 8 * * *", () => {
  sendGroupFirst().then((res) => {
    client.sendMessage("120363039408496373@g.us", res);
  });
});

// second notif function
const sendGroupSecond = async () => {
  try {
    let promisePenahanan = groupNotif.getDataPenahanan();
    let messagePenahanan = await promisePenahanan;
    let promiseBA = groupNotif.getDataBA();
    let messageBA = await promiseBA;
    let promisePutusanBelumMinut = groupNotif.getDataPutusanBelumMinut();
    let messagePutusanBelumMinut = await promisePutusanBelumMinut;
    let promiseBelumBhtPidana = groupNotif.getDataBelumBhtPidana();
    let messageBelumBhtPidana = await promiseBelumBhtPidana;
    let promiseBelumBhtPerdata = groupNotif.getDataBelumBhtPerdata();
    let messageBelumBhtPerdata = await promiseBelumBhtPerdata;
    let promiseBelumSerahHukum = groupNotif.getDataBelumSerahHukum();
    let messageBelumSerahHukum = await promiseBelumSerahHukum;
    let promiseTundaJadwalSidang = groupNotif.getDataTundaJadwalSidang();
    let messageTundaJadwalSidang = await promiseTundaJadwalSidang;
    let promiseSaksiTidakLengkap = groupNotif.getDataSaksiTidakLengkap();
    let messageSaksiTidakLengkap = await promiseSaksiTidakLengkap;
    let promisePutusanBelumBeritahu =
      groupNotif.getDataPutusanBelumBeritahuNew();
    let messagePutusanBelumBeritahu = await promisePutusanBelumBeritahu;
    let promiseJadwalSidangPidana = groupNotif.getDataJadwalSidangPidana();
    let messageJadwalSidangPidana = await promiseJadwalSidangPidana;
    let promiseJadwalSidangPerdata = groupNotif.getDataJadwalSidangPerdata();
    let messageJadwalSidangPerdata = await promiseJadwalSidangPerdata;
    let promiseJadwalMediasi = groupNotif.getDataJadwalMediasi();
    let messageJadwalMediasi = await promiseJadwalMediasi;
    let promiseSisaPanjarPn = groupNotif.getDataSisaPanjarPn();
    let messageSisaPanjarPn = await promiseSisaPanjarPn;
    let promiseSisaPanjarBanding = groupNotif.getDataSisaPanjarBanding();
    let messageSisaPanjarBanding = await promiseSisaPanjarBanding;
    let promiseSisaPanjarKasasi = groupNotif.getDataSisaPanjarKasasi();
    let messageSisaPanjarKasasi = await promiseSisaPanjarKasasi;
    let promiseDataCourtCalendar = groupNotif.getDataCourtCalendar();
    let messageDataCourtCalendar = await promiseDataCourtCalendar;
    let promiseStatistik = groupNotif.getStatistik();
    let messageStatistik = await promiseStatistik;
    let promiseBelumBhtBanding = groupNotif.getBelumBhtBanding();
    let messageBelumBhtBanding = await promiseBelumBhtBanding;
    let promiseBelumBhtKasasi = groupNotif.getBelumBhtKasasi();
    let messageBelumBhtKasasi = await promiseBelumBhtKasasi;

    // dataPenahanan().then((res) => {
    //   cron.schedule("*/1 * * * *", () => {
    //     client.sendMessage("6281337320205@c.us", res);
    //   });
    // });
    let msg = `*Data dari pesan ini diambil dari database SIPP dan hanya sebagai pengingat. _Data perkara yang muncul tidak selalu karena belum diinput, namun juga  karena masih sedang dalam proses (dalam waktu yang masih dibenarkan)_* \n\n*Statistik Penanganan Perkara Tahun ini (tidak termasuk perkara tilang)  :* \n${messageStatistik} \n\n*Data penahanan yang habis dalam 10 hari* : \n${messagePenahanan} \n\n*Data Putusan yang belum diminutasi* : \n${messagePutusanBelumMinut} \n\n*Data perkara pidana yang belum berisi tanggal BHT* : \n${messageBelumBhtPidana} \n\n*Data perkara perdata yang belum berisi tanggal BHT* : \n${messageBelumBhtPerdata} \n\n*Data perkara banding yang belum berisi tanggal BHT* : \n${messageBelumBhtBanding} \n\n*Data perkara kasasi yang belum berisi tanggal BHT* : \n${messageBelumBhtKasasi} \n\n*Data perkara yang belum dilakukan penundaan* : \n${messageTundaJadwalSidang} \n\n*Data perkara yang data saksi tidak lengkap* : \n${messageSaksiTidakLengkap} \n\n*Data perkara sudah putus yang belum diberitahukan* : \n${messagePutusanBelumBeritahu} \n\n*Jadwal sidang pidana hari ini* : \n${messageJadwalSidangPidana} \n\n*Jadwal sidang perdata hari ini* : \n${messageJadwalSidangPerdata} \n\n*Jadwal mediasi hari ini* : \n${messageJadwalMediasi} \n\n*Sisa panjar perkara tingkat pertama yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarPn} \n\n*Sisa panjar perkara tingkat banding yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarBanding} \n\n*Sisa panjar perkara tingkat kasasi yang telah putus dan belum dikembalikan* : \n${messageSisaPanjarKasasi} \n\n*Data perkara yang belum upload BA* : \n${messageBA} \n\n*Data perkara yang belum diserahkan ke bagian hukum* : \n${messageBelumSerahHukum} \n\n*Data perkara yang belum belum terdapat data court calendar sampai putusan/penetapan* : \n${messageDataCourtCalendar}`;
    return msg;
  } catch (error) {
    console.log(error);
  }
};

// second notif
cron.schedule("15 15 * * *", () => {
  sendGroupSecond().then((res) => {
    client.sendMessage("120363039408496373@g.us", res);
  });
});

client.on("message", async (msg) => {
  // Pesan masuk dan keluar
  let chat = await msg.getChat();
  let message = msg.body.toLocaleLowerCase();
  let id = msg.from;
  console.log(`Checking message from ${id}`);
  if (chat.isGroup === false)
    getData(message).then((res) => {
      msg.reply(res);
    });
});

client.on("change_battery", (batteryInfo) => {
  // Battery percentage for attached device has changed
  const { battery, plugged } = batteryInfo;
  console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on("change_state", (state) => {
  // Client state change
  console.log("CHANGE STATE", state);
});

client.on("disconnected", (reason) => {
  // Client on disconected
  console.log("Client was logged out", reason);
  if (reason == "NAVIGATION") {
    fs.unlinkSync("./session.json");
  }
});

// whatsapp api
app.post("/send-message", (req, res) => {
  let numberRaw = req.body.number;
  let numberId = `62${numberRaw.substring(1, 20)}@c.us`;
  let message = req.body.message;
  client
    .sendMessage(numberId, message)
    .then((response) => {
      res.status(200).json({
        status: true,
        response: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        response: err,
      });
    });
});

app.get("/send-message/:number/:message", (req, res) => {
  let numberRaw = req.params.number;
  let numberId = `62${numberRaw.substring(1, 20)}@c.us`;
  let message = req.params.message;
  client
    .sendMessage(numberId, message)
    .then((response) => {
      res.status(200).json({
        status: true,
        response: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        response: err,
      });
    });
});

app.listen(port, () => {
  console.log(`OKABOT listening at port ${port}`);
});
