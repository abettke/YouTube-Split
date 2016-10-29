let express = require('express');
let app = express();
let bodyParser = require('body-parser');

//Middleware for parsing the req body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let routes = require('./routes.js')(app);

app.listen(2444, ()=> {
	console.log('YouTube-Split Listening on port 2444.');
});