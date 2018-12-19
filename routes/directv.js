var router = require('express').Router();
var directv = require('directv-remote');
const promisifyAll = require('bluebird').promisifyAll;
var remote = promisifyAll(new directv.Remote(process.env.DIRECTV_HOST));

function getBoxes() {
	return remote.getLocationsAsync(1).then(locations => {
		var boxes = {};
		for (var i=0;i<locations["locations"].length;i++) {
			boxes[locations["locations"][i]["locationName"].toLowerCase()] = locations["locations"][i];
			delete boxes[locations["locations"][i]["locationName"].toLowerCase()].locationName;
		}
		return boxes;
	});
}
// update the locations on every request
router.use( async (req, res, next) => {
	try {
		let locations = await getBoxes();
		req.locations = locations;
		next();
	} catch(err) {
		resp.status(500).send({error: err});
	}
})

/* Returns the clientAddr for all devices unless the room is specified */
router.get("/", (req, resp) => {
	if (req.query.room && req.locations.hasOwnProperty(req.query.room.toLowerCase())) {
		resp.send(req.locations[req.query.room.toLowerCase()]);
	}else {
		resp.send(req.locations);
	}
});

router.post("/", async (req, resp) => {
	if (req.body.room && req.body.key && req.locations.hasOwnProperty(req.body.room.toLowerCase())) {
		try {
			let response = await remote.processKeyAsync(req.body.key, req.locations[req.body.room.toLowerCase()].clientAddr);
			resp.send(response);
		}catch(err) {
			resp.status(500).json({err: err});
		}
	}else {
		resp.json(req.locations);
	}
});

/*
 * Returns program information for a channel if provided
 * or
 * Returns the channel and program information of the current channel.
 */
router.use(["/channel", "/channel/:channel"], (req, resp, next) => {
	console.log()
	if (req.method == "GET" && !req.query.room) {
		req.query.room = "living";		
	} else if (req.method == "POST" && !req.body.room) {
		req.body.room = "living";
	}
	next();
})
router.get(["/channel", "/channel/:channel"], async (req, resp) => {
	if (req.params.channel) { // channel was provided
		try {
			let response = await remote.getProgInfoAsync(req.params.channel, null, req.locations[req.query.room.toLowerCase()].clientAddr);
			resp.send(response);
		} catch (err) {
			resp.status(500).send({err: err});
		}
	} else { // no channel provided. get the currently tuned channel
		try {
			let response = await remote.getTunedAsync(req.locations[req.query.room.toLowerCase()].clientAddr);
			resp.send(response);
		} catch (err) {
			resp.status(500).send({err: err});
		}
	}
})

/* tunes a box to a channel */
router.post("/channel/:channel", async (req, resp) => {
	try {
		let response = await remote.tuneAsync(req.params.channel, req.locations[req.body.room.toLowerCase()].clientAddr);
		resp.send(response);
	} catch (err) {
		resp.status(500).send({err: err});
	}
})
module.exports = router;
