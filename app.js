let express = require('express');
let Expert = require('./prof-expert');

console.log("start training");
let expert = new Expert();
console.log("trained");

let app = express();

app.set('views', './views')
app.set("view engine", "hbs");

app.get('/', (req, res) => {
	res.render('index', {
		question: expert.start().question,
		title: 'Профориентация'
	});
});

app.get('/answer/:answer', (req, res, next) => {
	switch (req.params.answer) {
		case 'yes':
			res.json(expert.setAnswer(1));
			break;
		case 'ratheryes':
			res.json(expert.setAnswer(.75));
			break;
		case 'dontknow':
			res.json(expert.setAnswer(.5));
			break;
		case 'ratherno':
			res.json(expert.setAnswer(.25));
			break;
		case 'no':
			res.json(expert.setAnswer(0));
			break;
	}
});

app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
	res.redirect('/');
});

module.exports = app;