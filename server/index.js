var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var neo4j = require('neo4j');
var when = require('when');

var path = require('path');

var db = new neo4j.GraphDatabase('http://192.168.200.197:7474');

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
	/*if (false && !req.session.authorized || req.params.user != req.session.user) {
		res.status(403).send("Not authorized");
		return;
	}*/

	if (req.session.userNode) {
		next();
		return;
	}

	findUser("tom95", function(err, node) {
		if (err) {
			res.send(500);
		} else {
			req.session.userNode = node;
			next();
		}
	});
}

io.sockets.on('connection', function(socket) {
});

// routes
app.get('/history', function(req, res) {
	res.sendfile("index.html", {root: "./app"});
});
app.get('/bookings', auth, function(req, res) {
	req.session.userNode.getRelationships("HAS_BOOKING", function(err, results) {
		handleGet(err, results, function(data) {
			res.send(data);
		}, function(err) {
			res.send(500);
		});
	});
});
app.get('/tasks', auth, function(req, res) {
	req.session.userNode.getRelationships("HAS_TASK", function(err, results) {
		handleGet(err, results, function(data) {
			res.send(data);
		}, function(err) {
			res.send(500);
		});
	});
});
app.get('/project/:project/tasks', auth, function(req, res) {
	db.getNodeById(req.params.project, function(err, projectNode) {
		if (err) {
			res.send(500);
			return;
		}
		projectNode.getRelationships("HAS_TASK", function(err, results) {
			handleGet(err, results, function(data) {
				res.send(data);
			}, function(err) {
				res.send(500);
			});
		});
	});
});
app.get('/projects', auth, function(req, res) {
	req.session.userNode.getRelationships("HAS_PROJECT", function(err, results) {
		handleGet(err, results, function(data) {
			res.send(data);
		}, function(err) {
			res.send(500);
		});
	});
});
app.get('/customer/:customer/projects', auth, function(req, res) {
	db.getNodeById(req.params.customer, function(err, customerNode) {
		if (err) {
			res.send(500);
			return;
		}

		customerNode.getRelationships("HAS_PROJECT", function(err, results) {
			handleGet(err, results, function(data) {
				res.send(data);
			}, function(err) {
				res.send(500);
			});
		});
	});
});
app.get('/customers', auth, function(req, res) {
	req.session.userNode.getRelationships("WORKS_FOR", function(err, results) {
		handleGet(err, results, function(data) {
			res.send(data);
		}, function(err) {
			res.send(500);
		});
	});
});

app.get('/history', auth, function(req, res) {
	res.sendfile('index.html', {root:'./app'});
});
app.get('/time-track', auth, function(req, res) {
	res.sendfile('index.html', {root:'./app'});
});
app.get('/administration', auth, function(req, res) {
	res.sendfile('index.html', {root:'./app'});
});
app.get('/export', auth, function(req, res) {
	res.sendfile('index.html', {root:'./app'});
});

app.post('/login/:user', function(req, res) {
	req.session.username = req.params.user;
	//TODO findUser(req.session.username);
});

app.post('/createUser', function(req, res) {
	db.createNode({name: req.body.name, username: req.body.username }).save(function (err, node) {
		if (err) { res.send(500); }
		else { res.send(); }
	});
});

// query to create BOOKING -> name, start[, end]
app.post('/task/:task/booking', auth, function(req, res) {
	var data = {
		description: req.body.description,
		start: req.body.start
	};
	if (req.body.end)
		data.end = req.body.end;

	db.createNode(data).save(function(err, bookingNode) {
		if (err) { res.send(500); }
		else {
			db.getNodeById(req.params.task, function(err, taskNode) {
				var deferred1 = when.defer();
				bookingNode.createRelationshipFrom(taskNode, "HAS_BOOKING", {}, function(err, rel) {
					if (err) { deferred1.reject(err); }
					else { deferred1.resolve(); }
				});
				var deferred2 = when.defer();
				bookingNode.createRelationshipFrom(req.session.userNode, "HAS_BOOKING", {}, function(err, rel) {
					if (err) { deferred2.reject(err); }
					else { deferred2.resolve(); }
				});
				when(deferred1.promise, deferred2.promise).then(function(result) {
					res.send();
				}, function(err) {
					res.send(500);
				});
			});
		}
	});
});
// query to create CUSTOMER -> name
app.post('/customer', auth, function(req, res) {
	db.createNode({name: req.body.name}).save(function(err, customerNode) {
		if (err) { res.send(500); }
		else {
			customerNode.createRelationshipFrom(req.session.userNode, "WORKS_FOR", {}, function(err, rel) {
				if (err) { res.send(500); }
				else { res.send(); }
			});
		}
	});
});
// query to create PROJECT -> name, estimatedTime
app.post('/customer/:customer/project', auth, function(req, res) {
	var data = { name: req.body.name };
	if (req.body.estimatedTime)
		data.estimatedTime = req.body.estimatedTime;
	db.createNode(data).save(function(err, projectNode) {
		if (err) { res.send(500); }
		else {
			db.getNodeById(req.params.customer, function(err, customerNode) {
				var deferred1 = when.defer();
				projectNode.createRelationshipFrom(req.session.userNode, "WORKS_IN", {}, function(err, rel) {
					if (err) { deferred1.reject(err); }
					else { deferred1.resolve(rel); }
				});
				var deferred2 = when.defer();
				projectNode.createRelationshipFrom(customerNode, "HAS_PROJECT", {}, function(err, rel) {
					if (err) { deferred2.reject(err); }
					else { deferred2.resolve(rel); }
				});
				when(deferred1.promise, deferred2.promise).then(function(rels) {
					res.send();
				}, function(err) {
					res.send(500);
				});
			});
		}
	});
});
// query to create TASK -> description, estimatedTime
app.post('/project/:project/task', auth, function(req, res) {
	var data = { description: req.body.description };
	if (req.body.estimatedTime) {
		data.estimatedTime = req.body.estimatedTime;
	}

	db.createNode(data).save(function(err, taskNode) {
		console.log(err);
		if (err) { res.send(500); }
		else {
			db.getNodeById(req.params.project, function(err, projectNode) {
				var deferred1 = when.defer();
				taskNode.createRelationshipFrom(projectNode, "HAS_TASK", {}, function(err, rel) {
					if (err) { deferred1.reject(err); }
					else { deferred1.resolve(rel); }
				});
				var deferred2 = when.defer();
				taskNode.createRelationshipFrom(req.session.userNode, "HAS_TASK", {}, function(err, rel) {
					if (err) { deferred2.reject(err); }
					else { deferred2.resolve(rel); }
				});
				when(deferred1.promise, deferred2.promise).then(function(rels) {
					res.send();
				}, function(err) {
					res.send(500);
				});
			});
		}
	});
});

app.put('/booking/:booking', auth, function(req, res) {
	db.getNodeById(req.params.booking, function(err, bookingNode) {
		if (err) {
			res.send(500);
			return;
		}

		bookingNode.data.end = req.body.end;
		bookingNode.save(function(err, node) {
			if (err) res.send(500);
			else res.send();
		});
	});
});

app.get('/history', auth, function(req, res) {
	res.sendfile('index.html', {root:'./app'});
});
app.get('/time-tracking', auth, function(req, res) {
	res.sendfile('index.html', {root:'./app'});
});
app.get('/administration', auth, function(req, res) {
	res.sendfile('index.html', {root:'./app'});
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
			callback(err, res[0].n);
		}
	});
}

function handleGet(err, results, successCallback, errorCallback) {
	if (err) {
		res.send(500);
	} else {
		var promises = [];
		for (var i in results) {
			(function() {
				var deferred = when.defer();
				promises.push(deferred.promise);
				db.getNodeById(results[i].end.id, function(err, node) {
					if (err) { deferred.reject(err); }
					else { deferred.resolve(node.data); }
				});
			})();
		}
		when.all(promises).then(successCallback, errorCallback);
	}
}

