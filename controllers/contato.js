module.exports = function(app) {
	var Usuario = app.models.usuario;

	var ContatoController = {
		index: function(req, res) {
			var _id = req.session.usuario._id;

			Usuario.findById(_id, function (erro, usuario) {
				var contatos = usuario.contatos;
				var resultado = { contatos: contatos };

				console.log(usuario);

				res.render('contatos/index', resultado);
			});
		},

		create: function(req, res) {
			var _id = req.session.usuario._id;

			Usuario.findById(_id, function (erro, usuario) {
				var contato = req.body.contato;
				var contatos = usuario.contatos;

				contatos.push(contato);

				usuario.save(function () {
					res.redirect('/contatos');
				});
			});
		},

		show: function(req, res) {
			var _id = req.session.usuario._id;

			Usuario.findById(_id, function (erro, usuario) {
				var contatoId = req.params.id;
				var contato = usuario.contatos.id(contatoId);

				var resultado = { contato: contato };

				res.render('contatos/show', resultado);
			});
		},

		edit: function(req, res) {
			var _id = req.session.usuario._id;

			Usuario.findById(_id, function (erro, usuario) {
				var contatoId = req.params.id;
				var contato = usuario.contatos.id(contatoId);

				var resultado = { contato: contato };

				res.render('contatos/edit', resultado);
			});
		},

		update: function(req, res) {
			var _id = req.session.usuario._id;

			Usuario.findById(_id, function (erro, usuario) {
				var contatoId = req.params.id;
				var contato = usuario.contatos.id(contatoId);

				contato.nome = req.body.contato.nome;
				contato.email = req.body.contato.email;

				usuario.save(function () {
					res.redirect('/contatos');
				});
			});
		},

		destroy: function(req, res) {
			var _id = req.session.usuario._id;
		
			Usuario.findById(_id, function (erro, usuario) {
				var contatoId = req.params.id;

				usuario.contatos.id(contatoId).remove();

				usuario.save(function () {
					res.redirect('/contatos');
				});
			});
		}
	};

	return ContatoController;
};