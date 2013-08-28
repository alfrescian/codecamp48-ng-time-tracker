var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var neo4j = require('neo4j');

var path = require('path');

var User = require('./models/user.js');
var Customer = require('./models/customer.js');
var Project = require('./models/project.js');
var Task = require('./models/task.js');
var Booking = require('./models/booking.js');


var db = new neo4j.GraphDatabase('http://localhost:7474');

// all environments
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('akj13i$q@2d'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// middleware
function auth(req, res, next) {
	if (!req.session.authorized || req.params.user != req.session.user) {
		res.status(302).send("Not authorized");
		return;
	}
	next();
}

io.sockets.on('connection', function(socket) {
});

// routes
app.get('/:user/:booking', auth, function(req, res) {
});
app.get('/:user/:task', auth, function(req, res) {
});
app.get('/:user/:project', auth, function(req, res) {
});
app.get('/:user/:customer', auth, function(req, res) {
});

app.post('/login/:user', function(req, res) {
});

app.post('/createUser', function(req, res) {
	var node = db.createNode({name: req.body.name, username: req.body.username });
	node.save(function (err, node) {
		if (err) {
			res.send(500);
		} else {
			res.send();
		}
	});
});

app.post('/:user/booking', auth, function(req, res) {
	// query -> name, datum start [end]
	// /tom/Name%20des%20booking?start=12345&end=23489
});
app.post('/:user/customer', auth, function(req, res) {
	// query -> name
});
app.post('/:user/:customer/project', auth, function(req, res) {
	new Project({name: req.query.name, estimatedTime: req.query.estimatedTime}).create(function(err, node) {
		console.log(node);
	});
	// query -> name, estimatedTime
});
app.post('/:user/:project/task', auth, function(req, res) {
	// query -> name, estimatedTime
});

app.put('/:user/:booking', auth, function(req, res) {
});

// grunt specifics
exports = module.exports = server;
exports.use = function() {
	app.use.apply(app, arguments);
}
