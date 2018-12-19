var router = require('express').Router();
const request = require('request-promise');

function sendMessage(msg, title) {
	var post_data = {
		"token": process.env.PUSHOVER_TOKEN,
		"user": process.env.PUSHOVER_USER,
		"message": msg
	}
	if (typeof title !== 'undefined' && title) {
		post_data["title"] = title;
	}
	return request({
		uri: "https://api.pushover.net/1/messages.json",
		method: "POST",
		form: post_data,
		resolveWithFullResponse: true
	});
}

function needsPush(req, resp, next) {
	/* middleware function:
	 * looks for a "push" parameter being passed in the request
	 */
	var pushover = { sendMessage: sendMessage };

	if ((typeof req.query.push !== 'undefined' && req.query.push) || (typeof req.body.push !== 'undefined' && req.body.push)) {
		pushover.needsPush = true;
	} else {
		pushover.needsPush = false
	}
	req.pushover = pushover;
	next();
}

router.post('/', async (req, resp) => {
	try {
		let response = await sendMessage(req.body.message, req.body.title);
		if (response.statusCode == 200) {
			resp.send({success: true})
		} else {
			resp.status(500).send({success: false, error: "Request returned: "+response.statusCode});
		}
	} catch(err) {
		resp.status(500).send({success: false, error: err});
	}
});

module.exports = {
	router: router,
	needsPush: needsPush
};
