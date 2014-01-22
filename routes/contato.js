module.exports = function(app) {
	var autenticar = require('./../middleware/autenticador');
	var contato = app.controllers.contato;

	app.get('/contatos', autenticar, contato.index);

	app.get('/contato/:id', autenticar, contato.show);

	app.post('/contato', autenticar, contato.create);

	app.get('contato/:id/editar', autenticar, contato.edit);

	app.put('contato/:id', autenticar, contato.update);

	app.del('/contato/:id', autenticar, contato.destroy);
};