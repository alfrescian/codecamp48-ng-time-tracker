var express = require('express');
var app = express();
var https = require('https');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var neo4j = require('neo4j');
var when = require('when');
var requestify = require('requestify');

var config = require('../config');

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

	if (req.session.userNode && req.session.userNode.exists) {
		next();
		return;
	}

	findUser("tom95", function(err, node) {
		if (err) {
			res.send(500, err);
		} else {
			req.session.userNode = node;
			next();
		}
	});
}

io.sockets.on('connection', function(socket) {
});

// routes
app.get('/api/booking/:id?', auth, function(req, res) {
	req.session.userNode.getRelationships("HAS_BOOKING", function(err, results) {
		handleGet(err, results, function(data) {
			extractAndSend(res, data, req.params.id);
		}, function(err) {
			res.send(500, err);
		});
	});
});
app.get('/api/task/:id?', auth, function(req, res) {
	req.session.userNode.getRelationships("HAS_TASK", function(err, results) {
		handleGet(err, results, function(data) {
			extractAndSend(res, data, req.params.id);
		}, function(err) {
			res.send(500, err);
		});
	});
});
app.get('/api/project/:project/task/:id?', auth, function(req, res) {
	db.getNodeById(req.params.project, function(err, projectNode) {
		if (err) {
			res.send(500, err);
			return;
		}
		projectNode.getRelationships("HAS_TASK", function(err, results) {
			handleGet(err, results, function(data) {
				extractAndSend(res, data, req.params.id);
			}, function(err) {
				res.send(500, err);
			});
		});
	});
});
app.get('/api/project/:id?', auth, function(req, res) {
	req.session.userNode.getRelationships("HAS_PROJECT", function(err, results) {
		handleGet(err, results, function(data) {
			extractAndSend(res, data, req.params.id);
		}, function(err) {
			res.send(500, err);
		});
	});
});
app.get('/api/customer/:customer/project/:id?', auth, function(req, res) {
	db.getNodeById(req.params.customer, function(err, customerNode) {
		if (err) {
			res.send(500, err);
			return;
		}

		customerNode.getRelationships("HAS_PROJECT", function(err, results) {
			handleGet(err, results, function(data) {
				extractAndSend(res, data, req.params.id);
			}, function(err) {
				res.send(500, err);
			});
		});
	});
});
app.get('/api/customer/:id?', auth, function(req, res) {
	req.session.userNode.getRelationships("WORKS_FOR", function(err, results) {
		handleGet(err, results, function(data) {
			extractAndSend(res, data, req.params.id);
		}, function(err) {
			res.send(500, err);
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

app.post('/api/createUser', function(req, res) {
	db.createNode({name: req.body.name, username: req.body.username }).save(function (err, node) {
		if (err) { res.send(500, err); }
		else { res.send(); }
	});
});

// query to create BOOKING -> name, start[, end]
app.post('/api/booking', auth, function(req, res) {
	var data = {
		description: req.body.description,
		start: Date.now()
	};
	if (req.body.end)
		data.end = req.body.end;

	db.createNode(data).save(function(err, bookingNode) {
		if (err) { res.send(500, err); }
		else {
            bookingNode.createRelationshipFrom(req.session.userNode, "HAS_BOOKING", {}, function(err, rel) {
                if (err) { res.send(500, err); }
                else { console.log(bookingNode); res.send( {data: bookingNode.data, id: bookingNode.id}); }
            });
		}
	});
});
// query to create CUSTOMER -> name
app.post('/api/customer', auth, function(req, res) {
	db.createNode({name: req.body.name}).save(function(err, customerNode) {
		if (err) { res.send(500, err); }
		else {
			customerNode.createRelationshipFrom(req.session.userNode, "WORKS_FOR", {}, function(err, rel) {
				if (err) { res.send(500, err); }
				else { console.log(customerNode); res.send( {data: customerNode.data, id: customerNode.id}); }
			});
		}
	});
});
// query to create PROJECT -> name, estimatedTime
app.post('/api/customer/:customer/project', auth, function(req, res) {
	var data = { name: req.body.name };
	if (req.body.estimatedTime)
		data.estimatedTime = req.body.estimatedTime;
	db.createNode(data).save(function(err, projectNode) {
		if (err) { res.send(500, err); }
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
					res.send({data: projectNode.data, id: projectNode.id});
				}, function(err) {
					res.send(500, err);
				});
			});
		}
	});
});
// query to create TASK -> description, estimatedTime
app.post('/api/project/:project/task', auth, function(req, res) {
	var data = { description: req.body.description };
	if (req.body.estimatedTime) {
		data.estimatedTime = req.body.estimatedTime;
	}

	db.createNode(data).save(function(err, taskNode) {
		if (err) { res.send(500, err); }
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
					res.send({data: taskNode.data, id: taskNode.id});
				}, function(err) {
					res.send(500, err);
				});
			});
		}
	});
});

app.put('/api/booking/:booking', auth, function(req, res) {
	db.getNodeById(req.params.booking, function(err, bookingNode) {
		if (err) {
			res.send(500, err);
			return;
		}
            
        db.getNodeById(req.body.task, function(err, taskNode) {
            var deferred1 = when.defer();
            bookingNode.createRelationshipFrom(taskNode, "HAS_BOOKING", {}, function(err, rel) {
                if (err) { deferred1.reject(err); }
                else { deferred1.resolve(); }
            });
            var deferred2 = when.defer();
            
            bookingNode.data.end = Date.now();
            if (req.body.description){
                bookingNode.data.description = req.body.description
            }
            bookingNode.save(function(err, node) {
                if (err) { deferred2.reject(err); }
                else { deferred2.resolve(); }
            });
            
            when(deferred1.promise, deferred2.promise).then(function(result) {
                res.send();
            }, function(err) {
                res.send(500, err);
            });
        });
	});
});

// login stuff
app.post('/login/:user', function(req, res) {
	req.session.username = req.params.user;
	//TODO findUser(req.session.username);
});
/*app.get('/authcallback', function(req, res) {
	requestify.post("https://github.com/login/oauth/access_token", {
		body: {
			client_id: config.github.clientId,
			client_secret: config.github.secret,
			code: req.query.code,
			redirect_uri: config.oauthRedirectUri
		},
		method: 'POST',
		dataType: 'form-url-encoded'
	}).then(function(res) {
		console.log(res.getData());
	}, function(err) {
		console.log(err);
	});
});
app.get('/test', function(req, res) {
	res.sendfile('test.html', {root: './app'});
});*/

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
		res.send(500, err);
	} else {
		var promises = [];
		for (var i in results) {
			(function() {
				var deferred = when.defer();
				promises.push(deferred.promise);
				db.getNodeById(results[i].end.id, function(err, node) {
					if (err) { deferred.reject(err); }
					else { deferred.resolve(node); }
				});
			})();
		}
		when.all(promises).then(successCallback, errorCallback);
	}
}

function extractAndSend(res, data, id) {
	console.log("abc");
	var found = false;
	if (id) {
		for (var i in data) {
			if (data[i].id == id) {
				data = [data[i]];
				found = true;
				break;
			}
		}

		if (!found) {
			res.send(404);
			return;
		}
	}

	var list = [];
	for (var i in data) {
		list.push({data: data[i].data, id: data[i].id});
	}
	res.send(list);
}
