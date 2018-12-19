const app = require('./app')

var port = process.argv[2] || 3000;

app.listen(port,() => { console.log('Listening on port '+port+'!') })
