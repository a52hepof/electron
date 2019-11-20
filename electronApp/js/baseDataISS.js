//const {mysql} =require('electron')


var mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "vn9rn7rz",
    database: "ISS"
});

connection.connect(function (err) {
    if(err){
        console.log("error");
    }else{
        console.log("connected");
    }
});

var sql = 'SELECT *, FROM `consultaISS`';
console.log(sql)

connection.query(sql, function (error, results, fields) {
 if (error) console.log(error.code);
 else {
     console.log(results);
     //$('#resultDiv').text(results[0].emp_name); //emp_name is column name in your database
 }
});
