var router = require('express').Router();
var CouchPotatoAPI = require('couchpotato-api');
 
var cp = new CouchPotatoAPI({
  hostname: process.env.COUCH_HOST,
  apiKey: process.env.COUCH_KEY,
  port: 5050,
  urlBase: ''
});

router.get("/status", async (req, res) => {
	if (req.query.mark_read == "true" || req.query.clear_notifications == "true") {
		await cp.get("notification.markread");
	}
	var resp = {}
	try {
		resp.available = (await cp.get("app.available")).success;
		resp.version = (await cp.get("app.version")).version;
		resp.notifications =(await cp.get("notification.list")).notifications.filter(x => (!("read" in x) || x.read == false));
	} catch (err) {
		resp.available = false;
	}
	res.send(resp);
});

router.get("/", async (req, res) => {
	if (!req.query.title) {
		res.status(400).send("need title");
	} else {
		let movies = (await cp.get("search", {q: req.query.title})).movies;
		movies = movies.map((movie) => {
			return {
				title: movie.original_title,
				year: movie.year,
				imdb: movie.imdb,
				actors: (movie.actor_roles) ? Object.keys(movie.actor_roles) : []
			}
		})
		res.send(movies);
	}
})

router.post("/", async (req, res) => {
	var movie = {}
	if (req.body.imdb) {
		movie.identifier = req.body.imdb;
	}
	if (req.body.title) {
		movie.title = req.body.title;
	}
	if (Object.keys(movie).length === 0) {
		res.status(400).send("need title or imdb");
	} else {
		cp.get("movie.add", movie).then(resp => {
			res.send(resp)
		})
	}
})

module.exports = router;
