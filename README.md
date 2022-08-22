# whatsappbot-nodejs-simple
Whatsapp bot ini dibuat dengan format pesan respon khusus untuk satker Pengadilan, namun tetap bisa dikustomisasi oleh pengguna lain sesuai kebutusan. Whatsapp bot ini dibuat dengan platform [whatsapp-web-js](https://github.com/pedroslopez/whatsapp-web.js/), dan dibuat menggunakan bahasa javascript dengan runtime environment node-js. Whatsapp bot ini juga dapat digunakan untuk api dan diintegrasikan dengan project yang anda buat.

Prerequisit :
* Smartphone yang telah terinstall aplikasi whatsapp
* Node JS

Langkah-langkah penggunaan :
1. Silahkan download terlebih dahulu [node-js](https://nodejs.org/en/download/), kemudian install di komputer yang akan dijadikan server untuk whatsapp bot. 
2. Clone atau download repo ini.
3. Jalankan terminal dan arahkan ke folder tempat hasil download repo ini.
4. Download dependencies pada terminal  dengan mengetikkan
   > $ npm install
5. Penginstallan dependencies akan memakan waktu cukup lama tergantung koneksi internet, pastikan agar pengunduhan selesai.
5. Selanjutnya jalankan perintah 
   > $ node app
   
   atau gunakan node js proccess manager untuk menjalankan aplikasi agar bisa restart otomatis apabila terjadi crash, seperti [supervisor](https://www.npmjs.com/package/supervisor)

6. silahkan buka browser, dan ketikkan http://localhost:(port)
 
 ### Kustomisasi Pesan dan Database
 Untuk mengkostumisasi pesan respon, silahkan ubah di file **query.js**, dan untuk merubah koneksi ke database silahkan ubah pada file **db_config.js**.
 **Penting : Sangat disarankan untuk menggunakan _clone_ Database SIPP**

 ### Notifikasi ke Group Whatsapp
 Bot ini juga menyediakan fitur notifikasi group. Untuk menggunakannya, silahkan tambahkan kontak bot ke grup whatsapp, selanjutnya perhatikan id group whatsapp pada terminal (didapatkan setelah ada pesan masuk di grup). ID grup berakhiran dengan ...@g.us. Silahkan replace pada variabel groupId. Notifikasi yang 
 dikirimkan antara lain :

* Scrapping EIS
 * Data penahanan yang akan habis dalam 10 hari
 * Putusan yang belum diminutasi
 * Putusan yang belum diberitahukan
 * BA yang belum diupload, dll

Default jadwal notifikasi adalah pukul 08.15  dan 15.15 setiap hari, untuk merubahnya, silahkan ganti pada baris ke script node cron

### API

 Untuk menggunakan api silahkan hit ke : http://domainanda.com:port/send-message/nomor_tujuan(format 081xxxx)/pesan_anda (_versi beta, karena baru dites pada localhost_)

 

   Feel free to contact me :

   **Telegram**: @Okawiadnyana






