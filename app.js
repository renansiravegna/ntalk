var express = require('express');

var app = express();

var load = require('express-load');
var error = require('./middleware/error')

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var mongoose = require('mongoose');

global.db = mongoose.connect('mongodb://localhost/ntalk');

const KEY = 'ntalk.sid',
	  SECRET = 'ntalk';

var cookie = express.cookieParser(SECRET),
	store = new express.session.MemoryStore(),
	sessionOptions = { secret: SECRET, key: KEY, store: store },
	session = express.session(sessionOptions);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookie);
app.use(session);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.use(error.notFound);
app.use(error.serverError);

io.set('authorization', function (data, accept) {
	cookie(data, {}, function (err) {
		var sessionID = data.signedCookies[KEY];

		store.get(sessionID, function (error, session) {
			if (error || !session)
				accept(null, false);
			else {
				data.session = session;
				accept(null, true);
			}
		});
	});
});

load('models').then('controllers').then('routes').into(app);
load('sockets').into(io);

server.listen(3000, function() {
	console.log("Ntalk no ar.");
});