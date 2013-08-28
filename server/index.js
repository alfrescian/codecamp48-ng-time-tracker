var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var neo4j = require('neo4j');

var path = require('path');

var db = new neo4j.GraphDatabase('http://localhost:7474');

// all environments
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('akj13i$q@2d'));
app.use(express.session());
app.use(app.router);
app.use(express.static('../' + __dirname + '/app'));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// middleware
function auth(req, res, next) {
	if (!req.session.authorized || req.params.user != req.session.user) {
		res.status(403).send("Not authorized");
		return;
	}
	next();
}

io.sockets.on('connection', function(socket) {
});

// routes
app.get('/user/:user/:booking', auth, function(req, res) {
	res.send();
});
app.get('/user/:user/:task', auth, function(req, res) {
	res.send();
});
app.get('/user/:user/:project', auth, function(req, res) {
	res.send();
});
app.get('/user/:user/:customer', auth, function(req, res) {
	res.send();
});

app.post('/login/:user', function(req, res) {
	req.session.username = req.params.user;
	req.session.userNode = findUser(req.session.username);
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

app.post('/user/:user/booking', auth, function(req, res) {
	// query -> name, datum start [end]
	// /tom/Name%20des%20booking?start=12345&end=23489
});
app.post('/user/:user/customer', auth, function(req, res) {
	// query -> name
	var node = db.createNode({name: req.body.name});
	node.save(function(err, node) {
		if (err) {
			res.send(500);
		} else {
			node.createRelationshipTo(req.session.userNode, "WORKS_FOR", {}, function(err, rel) {
				if (err) {
					res.send(500);
				} else {
					res.send();
				}
			});
		}
	});
});
app.post('/user/:user/:customer/project', auth, function(req, res) {
	var node = db.creatNode({name: req.body.name, estimatedTime: req.query.estimatedTime});
	node.save(function(err, node) {
	});
	// query -> name, estimatedTime
});
app.post('/user/:user/:project/task', auth, function(req, res) {
	// query -> name, estimatedTime
});

app.put('/update/:user/:booking', auth, function(req, res) {
});

// grunt specifics
exports = module.exports = server;
exports.use = function() {
	app.use.apply(app, arguments);
}

function findUser(username, callback) {
	var userNode = db.query([
		'START n=node(*)',
		'WHERE has(n.username) and (n.username="' + username + '")',
		'RETURN n'
	].join('\n'), function(err, res) {
		if (err || !res || res.length == 0) {
			callback(err, null);
		} else {
			callback(err, res[0]);
		}
	});
}

