//const {mysql} =require('electron')


var mysql = require("mysql");


var sql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vn9rn7rz",
    database: "ISS"
});

sql.connect(function (err) {
    if(err){
        console.log("error");
    }else{
        console.log("connected");
    }
});

var sql = 'SELECT *, FROM `consultaISS`';
console.log(sql)
