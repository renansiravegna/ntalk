var express = require('express');

var app = express();

var load = require('express-load');
var error = require('./middleware/error')

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.cookieParser('ntalk'));
app.use(express.session());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.use(error.notFound);
app.use(error.serverError);

load('models').then('controllers').then('routes').into(app);

io.sockets.on('connection', function(client) {
	client.on('send-server', function(data) {
		var msg = "<b>" + data.nome + ":</b>" + data.msg + "<br/>";

		client.emit('send-client', msg);
		client.broadcast.emit('send-client', msg);	
	});
});

server.listen(3000, function() {
	console.log("Ntalk no ar.");
});