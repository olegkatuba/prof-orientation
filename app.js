let express = require('express');
let Expert = require('./prof-expert');

let app = express();

let user;

app.set('views', './views')
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/public"));

app.disable('expert');

app.get('/wait', (req, res, next) => {
	console.log('wait');
	user = res;
});

app.use((req, res, next) => {
	if(app.enabled('expert')){
		next('route');
	} else{
		res.render('loading');
	}
});

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

app.use((req, res, next) => {
	res.redirect('/');
});


console.log("start training");
let expert;
new Expert().then(exp => {
	expert = exp;
	app.enable('expert');
	console.log("trained");
	user && user.end();
});

module.exports = app;