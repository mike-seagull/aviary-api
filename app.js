const app = require('express')();
var morgan = require('morgan')
var bodyParser = require('body-parser');
var auth = require("./auth");
var garage = require("./routes/garage");
var pushover = require("./routes/pushover");
var generic = require("./routes/generic");
var directv = require("./routes/directv");
var couch = require("./routes/couchpotato");

// pretty json
app.set('json spaces', 2);
// Tell Express to use the remote IP address
app.set('trust proxy', true);
// access logging
app.use(morgan('common'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// set basic auth
app.use(auth)
app.use(pushover.needsPush);
const base_url = "/api";
app.use(base_url, generic);
app.use(base_url+"/garage", garage);
app.use(base_url+"/pushover", pushover.router);
app.use(base_url+"/directv", directv);
app.use(base_url+"/couch", couch);

module.exports = app;
