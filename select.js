const puppeteer = require("puppeteer");

let getSkorBulanan = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto("http://evaluasi.badilum.mahkamahagung.go.id/", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(
      ".table.table-hover.table-striped.table-td-valign-middle.mx-auto.w-auto",
      {
        visible: true,
      }
    );
    await page.select("select#kategori", "2");
    await page.select("select#kelas", "4");
    await page.select("select#bulan_awal", "08");
    await page.select("select#tahun_awal", "2022");
    await page.select("select#bulan_akhir", "08");
    await page.select("select#tahun_akhir", "2022");

    await page.evaluate(() =>
      document.querySelector(".btn.btn-sm.btn-success.m-r-5").click()
    );

    await new Promise((r) => setTimeout(r, 2000));

    const rows = await page.$$("#TabelData tbody tr");

    let responseMessage;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const nilai = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );

      if (pn === "Pengadilan Negeri Negara") {
        responseMessage = `Peringkat: ${nomor} \nSkor: ${nilai}`;
      }
    }
    await browser.close();
    return responseMessage;
  } catch (error) {
    responseMessage = `Koneksi ke eis terputus`;
    await browser.close();
    return responseMessage;
  }
};

let getSkorTahunanKelas = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto("http://evaluasi.badilum.mahkamahagung.go.id/", {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await page.waitForSelector(
      ".table.table-hover.table-striped.table-td-valign-middle.mx-auto.w-auto",
      {
        visible: true,
      }
    );
    await page.select("select#kategori", "2");
    await page.select("select#kelas", "4");
    // await page.select("select#bulan_awal", month);
    // await page.select("select#tahun_awal", year);
    // await page.select("select#bulan_akhir", month);
    // await page.select("select#tahun_akhir", year);

    await page.evaluate(() =>
      document.querySelector(".btn.btn-sm.btn-success.m-r-5").click()
    );

    await new Promise((r) => setTimeout(r, 2000));

    const rows = await page.$$("#TabelData tbody tr");

    let responseMessage;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const nilai = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );

      if (pn === "Pengadilan Negeri Negara") {
        responseMessage = `Peringkat: ${nomor} \nSkor: ${nilai}`;
      }
    }
    await browser.close();
    return responseMessage;
  } catch (error) {
    responseMessage = `Koneksi ke eis terputus`;
    await browser.close();
    return responseMessage;
  }
};

let getDataTahunan = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    await page.goto("http://evaluasi.badilum.mahkamahagung.go.id/", {
      waitUntil: "networkidle0",
      timeout: 0,
    });

    const rows = await page.$$("#TabelData tbody tr");
    let responseMessage;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const pn = await row.$eval(
        "td:nth-child(4) div a",
        (element) => element.textContent
      );

      const nomor = await row.$eval(
        "td:nth-child(1) div",
        (element) => element.textContent
      );

      const nilai = await row.$eval(
        "td:nth-child(9) div b",
        (element) => element.textContent
      );

      if (pn === "Pengadilan Negeri Negara") {
        responseMessage = `Peringkat: ${nomor} \nSkor: ${nilai}`;
      }
    }

    await browser.close();
    return responseMessage;
  } catch (error) {
    responseMessage = `Koneksi ke eis terputus`;
    await browser.close();
    return responseMessage;
  }
};

// getDataTahunan().then((res) => console.log(res));
module.exports = {
  getSkorBulanan,
  getSkorTahunanKelas,
  getDataTahunan,
};
