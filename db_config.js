const mysql =require('mysql');
const db = mysql.createConnection({
    host:'192.168.1.60',
    user:'kom_tengah',
    password:'hukum12345',
    database:'sipp'

});

// db.connect((err)=>{
//     if(err) throw err;
//     console.log('Connected');
// })

module.exports = db; 