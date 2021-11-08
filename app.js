const fs = require("fs");
const { Client, Location, List, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const getData = require("./query");

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
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

//saat diotentifikasi
client.on("authenticated", (session) => {
  console.log("AUTHENTICATED", session);
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

//saat wa sudah siap
client.on("ready", () => {
  console.log("READY");
});

//mulai logika pesan masuk
// client.on("message", (msg) => {
//   let keywords = msg.body.toLocaleLowerCase().split("#");
//   if (keywords[0] == "perkara") {
//     let hasil = query(
//       `SELECT * FROM daftar_perkara_tbl WHERE id=${keywords[1]}`
//     );
//     hasil.then((res) => {
//       msg.reply(
//         `Nomor perkara ${res[0].nomor_perkara} Nama Pihak ${res[0].pihak_1}`
//       );
//     });
//   }
// });

client.on("message", (msg) => {
  let message = msg.body.toLocaleLowerCase();
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
  console.log("CHANGE STATE", state);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
  if (reason == "NAVIGATION") {
    fs.unlinkSync("./session.json");
  }
  // client.destroy();

  // fs.unlinkSync("./session.json");
});
// client.initialize();
