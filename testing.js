const mysql = require('mysql');

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'LuBash98',
    database: 'chat',
});

con.connect(function(err) {
  if (err) throw err;
  con.query(`SELECT * FROM posts ORDER BY id ASC`,

  
  function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

