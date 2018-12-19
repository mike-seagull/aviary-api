var router = require('express').Router();
var myq = require('myq-node');
const username = process.env.MYQ_USER
const password = process.env.MYQ_PASS
myq.login(username, password);

//var garage = { id: null, name: null, state: null, uptime: null };

function updateStatus() {
	var garage = { id: null, name: null, state: null, uptime: null }
	return myq.getDevices().then(devices => {
		var garage_id = null;
		for (var i=0; i<devices.Devices.length; i++) {
			var device = devices.Devices[i];
			if (device.MyQDeviceTypeName == "GarageDoorOpener") {
				garage.id = device.MyQDeviceId;
				garage.name = device.MyQDeviceTypeName;
				break;
			}
		}
		if (garage.id) {
			return myq.getState(garage.id)
		}else {
			throw new Error('no garage id found');
		}
	}).then(state => {
		garage.state = state.state;
		garage.uptime = state.UpdatedTime;
		return garage;
	}, (err) => {
		return err;
	});
}

// update the garage variable on every request
router.use( async (req, res, next) => {
	try {
		let garage = await updateStatus();
		req.garage = garage;
		next();
	} catch(err) {
		resp.status(500).send({error: err});
	}
})

router.get('/', (req, resp) => {
	if (req.pushover.needsPush) {
		req.pushover.sendMessage(JSON.stringify(req.garage), "Garage");
	}
	resp.send(req.garage);
});

router.post('/', async (req, resp) => {
	var open = req.body.open;
	var close = req.body.close;
	var action = req.body.action;
	if ([true, "true", "1", 1].indexOf(open) > -1 || [false, "false", "0", 0].indexOf(close) > -1 || action == "open") {
		// they want this thing open
		try {
			let door = await myq.openDoor(req.garage.id);
			if (req.pushover.needsPush) {
				req.pushover.sendMessage("opening garage", "Garage");
			}
			resp.send({success:true,response:door})
		} catch(err) {
			resp.status(500).send({success:false, error: err});
		}
	} else if ([false, "false", "0", 0].indexOf(open) > -1 || [true, "true", "1", 1].indexOf(close) > -1 || action == "close") {
		// they want this thing closed
		try {
			let door = await myq.closeDoor(req.garage.id);
			if (req.pushover.needsPush) {
				req.pushover.sendMessage("closing garage", "Garage");
			}
			resp.send({success:true, response:door})
		}catch(err) {
			resp.status(500).send({success:false, error: err});
		}
	} else {
		resp.status(500).send({success: false, error: "General error"})
	}
});


module.exports = router;
