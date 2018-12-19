var router = require('express').Router();

/* use this to quick test if the server is listening */
router.get('/heartbeat', (req, resp) => {
	if (req.pushover.needsPush) {
		req.pushover.sendMessage("got check", "Heartbeat");
	}
	resp.send("BOO-BUM");
});
module.exports = router;