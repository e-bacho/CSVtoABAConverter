var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var util = require('util');

app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(multer({
	dest: './static/uploads/',
	rename: function (fieldname, filename) {
		return filename.replace(/\W+/g, '-').toLowerCase();
	}
}));

app.use(express.static(__dirname + '/static'));

function getExtension(fn) {
	return fn.split('.').pop();
}

app.get('/', function(req, res) {
	fs.readFile("index.html", function(err, text){
		res.setHeader("Content-Type", "text/html");
		res.end(text);
		// res.end(util.inspect(require('./src/convert.js')));
	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});

app.post('/file-upload', function(req, res, next) {
	if (getExtension(req.files.csv.name) == 'csv')
	{
		var data = fs.readFileSync(req.files.csv.path, 'ascii'); 
		res.end(require('./src/convert.js').generateABAFile(data));
		fs.unlink(req.files.csv.path, function (err) {
			if (err) throw err;
			console.log('successfully deleted ' + req.files.csv.path);
		});
	}
});