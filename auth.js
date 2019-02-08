const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const router = require('express').Router();

const mongo_user = process.env.DB_USER
const mongo_pass = process.env.DB_PASS
const pepper = process.env.PEPPER
const mongo_url = process.env.DB_URL
const db_name = process.env.DB_NAME

async function authorization_middleware(req, res, next) {
	const NO_AUTH_ENDPOINTS = ["/api/heartbeat"]
	if (NO_AUTH_ENDPOINTS.indexOf(req.path) === -1) {
		// this endpoint need authorization
		if (req.headers.authorization) {
			let auth_header = req.headers.authorization.replace('Basic ','');
			auth_header = new Buffer(auth_header, 'base64').toString('ascii')
			let [username, password] = auth_header.split(":")
			MongoClient.connect("mongodb+srv://"+mongo_user+":"+mongo_pass+"@"+mongo_url, useNewUrlParser=true, (err, client) => {
				const db = client.db(db_name);
				db.collection("users").findOne({"username": username},{projection: {_id: false, "salt": true}},(err, result) => {
					if(result) {
						const salt = result.salt;
						var hash = crypto.createHash('sha256').update(salt+password+pepper).digest('hex');
						db.collection('users').findOne({"username": username, "password": hash}, (err, result) => {
							if(result) {
					    		next()
								client.close()
					    	} else {
								res.status(401).send("Access Denied")
								client.close()
					    	}
						})
					} else {
						res.status(401).send("Access Denied")
						client.close()
					}
				})
			})
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
		let salt = await genRandomString(10)
		generated_hash = crypto.createHash('sha256').update(salt+password+pepper, 'utf8').digest('hex')
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

