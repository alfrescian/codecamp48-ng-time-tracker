
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var path = require('path');

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
function auth(req, res) {
	if (req.session.username == req.user && req.session.authorized) {
	}
}

io.sockets.on("connection", function(socket) {
});


// routes
/*
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
app.post('/:user/booking', auth, function(req, res) {
	query -> name, datum start [end]
	/tom/Name des booking?start=12345&end=23489
});
app.post('/:user/customer', auth, function(req, res) {
	query -> name
});
app.post('/:user/:customer/project', auth, function(req, res) {
	query -> name, estimatedTime
});
app.post('/:user/:project/task', auth, function(req, res) {
	query -> name, estimatedTime
});

app.update('/:user/:booking', auth, function(req, res) {
});*/

// grunt specifics
exports = module.exports = server;
exports.use = function() {
	app.use.apply(app, arguments);
}

