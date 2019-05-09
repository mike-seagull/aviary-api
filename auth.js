const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const router = require('express').Router();
const mysql = require('mysql');

const mysql_user = process.env.DB_USER
const mysql_pass = process.env.DB_PASS
const pepper = process.env.PEPPER
const mysql_host = process.env.DB_URL
const db_name = process.env.DB_NAME

async function authorization_middleware(req, res, next) {
	const NO_AUTH_ENDPOINTS = ["/api/heartbeat"]
	if (NO_AUTH_ENDPOINTS.indexOf(req.path) === -1) {
		// this endpoint need authorization
		if (req.headers.authorization) {
			let auth_header = req.headers.authorization.replace('Basic ','');
			auth_header = new Buffer(auth_header, 'base64').toString('ascii')
			let [username, password] = auth_header.split(":")

			var conn  = mysql.createConnection({host: mysql_host, user: mysql_user, password: mysql_pass, database: db_name});

			conn.query('SELECT salt, password FROM users WHERE username="'+username+'" LIMIT 1;', (error, results, fields) => {
			  	conn.end()
				if (results.length > 0) {
					const salt = results[0].salt
					const correct_password = results[0].password
					const hash = crypto.createHash('sha256').update(salt + password + pepper).digest('hex');
					if(correct_password == password) {
			    		next()
						client.close()
			    	} else {
						res.status(401).send("Access Denied")
						client.close()
			    	}
				}else {
					res.status(401).send("Access Denied")
					client.close()					
				}
			});
		} else {
			res.status(401).send("Access Denied")	
			client.close()
		}
	} else {
		// no auth needed
		next()
	}
}
function genRandomString(length) {
	return new Promise((res, rej) => {
		string = crypto.randomBytes(Math.ceil(length/2))
            		.toString('hex') /** convert to hexadecimal format */
            		.slice(0,length);   /** return required number of characters */
        res(string)
	})
};
router.get('/', async (req, resp) => {
	if (req.query.password) {
		let salt = req.query.salt || await genRandomString(10)
		generated_hash = crypto.createHash('sha256')
			.update(salt + req.query.password + pepper, 'utf8')
			.digest('hex')
		resp.send({
			salt: salt,
			hash: generated_hash
		})
	} else {
		resp.status(500).send({err: "need a password"})
	}
})
module.exports = {
	middleware: authorization_middleware,
	router: router
};

