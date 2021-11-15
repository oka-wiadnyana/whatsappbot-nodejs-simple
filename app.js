const fs = require("fs");
const { Client, Location, List, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const getData = require("./query");
const express = require("express");
const app = express();
const port = 3000;

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

client.on("authenticated", (session) => {
  //saat diotentifikasi
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

client.on("ready", () => {
  //saat wa sudah siap
  console.log("READY");
});

client.on("message", (msg) => {
  // Pesan masuk dan keluar
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
  console.log(`Whatsapp api listening at port ${port}`);
});
