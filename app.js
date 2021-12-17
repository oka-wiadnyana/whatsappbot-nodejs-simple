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

client.on("ready", async () => {
  //saat wa sudah siap
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

    // dataPenahanan().then((res) => {
    //   cron.schedule("*/1 * * * *", () => {
    //     client.sendMessage("6281337320205@c.us", res);
    //   });
    // });
    cron.schedule("0 8 * * *", () => {
      client.sendMessage(
        "120363021004523753@g.us",
        `*Data penahanan yang habis dalam 10 hari* : \n${messagePenahanan} \n*Data perkara yang belum upload BA* : ${messageBA} \n*Data Putusan yang belum diminutasi* : ${messagePutusanBelumMinut} \n*Data perkara pidana yang belum berisi tanggal BHT* : ${messageBelumBhtPidana} \n*Data perkara perdata yang belum berisi tanggal BHT* : ${messageBelumBhtPerdata} \n*Data perkara yang belum diserahkan ke bagian hukum* : ${messageBelumSerahHukum} \n*Data perkara yang belum dilakukan penundaan* : ${messageTundaJadwalSidang} \n*Data perkara yang data saksi tidak lengkap* : ${messageSaksiTidakLengkap} \n*Data perkara sudah putus yang belum diberitahukan* : ${messagePutusanBelumBeritahu} \n*Jadwal sidang pidana hari ini* : ${messageJadwalSidangPidana} \n*Jadwal sidang perdata hari ini* : ${messageJadwalSidangPerdata} \n*Jadwal mediasi hari ini* : ${messageJadwalMediasi}`
      );
    });
  } catch (error) {
    console.log(error);
  }

  console.log("READY");
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
