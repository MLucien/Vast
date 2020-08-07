/**
* buzz config folder and file
	connectionLimit: process.env.connection,
			host: process.env.host,
			user: process.env.user,
			password: process.env.password,
			database: process.env.chat,
			insecureAuth : true
* import part of the project, we will use .env to safeguard the database login information of the server
*/


const mysql = require('mysql');

class Db {
	constructor(config) {
		this.connection = mysql.createPool({
			//process.env is our system filed used to protect the server credentials
			connectionLimit: 100,
			host: process.env.host,
			user: process.env.user,
			password: process.env.password,
			database: process.env.chat,
			insecureAuth : true
		});
	}
	query(sql, args) {
		//checking for a promise
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows);
			});
		});
	}
	close() {

				//checking for the returned promise

		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err)
					return reject(err);
				resolve();
			});
		});
	}
}
module.exports = new Db();