const brain = require('brain.js');
const allProfessions = require('./professions');
const allQuestions = require('./questions');
const data = require('./knowledge');
const maxMin = require('../max-min');

let net = new brain.NeuralNetwork();

class Expert {

	constructor() {
		this.allProfessions = allProfessions;
		this.allQuestions = allQuestions;
		net.train(data);
	}

	start() {
		this.professions = this.allProfessions.map(i => i);
		this.questions = this.allQuestions.map(i => i);
		this.answers = {};
		for (let i = 0; i < 46; i++)
			this.answers[i] = 0.5;

		let someProfession = this.professions[Math.floor(Math.random() * this.professions.length)];
		this.stack = this.questions.filter(q => q.professions.some(p => someProfession.id === p));
		this.questions = this.questions.filter(q => !this.stack.some(qs => qs === q));
		//console.log(someProfession);
		//console.log(this.stack);
		this.currentQuestion = this.stack[Math.floor(Math.random() * this.stack.length)];
		return {type: 'question', question: this.currentQuestion.question};
	}

	setAnswer(answer) {
		let index = this.stack.indexOf(this.currentQuestion);
		if (index !== -1)
			this.stack.splice(index, 1);
		index = this.questions.indexOf(this.currentQuestion);
		if (index !== -1)
			this.questions.splice(index, 1);

		if (answer === 1)
			this.yesAnswer.call(this);
		else if (answer === 0)
			this.noAnswer.call(this);
		this.answers[this.currentQuestion.id] = answer;

		//this.professions = this.professions.filter(p => this.questions.some(pq => pq.professions.some(pp => pp === p.id)));

		if (!this.stack.length) {
			let someProfession = this.professions[Math.floor(Math.random() * this.professions.length)];
			this.stack = this.questions.filter(q => q.professions.some(p => someProfession.id === p));
		}

		if (this.stack.length === 0) {
			//console.log(this.answers);
			let res = net.run(this.answers);

			let arr = [];
			for (let key in res) {
				arr.push(res[key]);
			}
			let clusters = maxMin.cluster(arr);
			console.log(res);

			return {type: 'answer', professions: clusters[0].map(i => this.allProfessions[i].profession).slice(0, 5)};
		}
		//console.log(this.stack);
		//console.log(this.professions);
		//console.log(this.answers);
		this.currentQuestion = this.stack[Math.floor(Math.random() * this.stack.length)];
		return {type: 'question', question: this.currentQuestion.question};
	}

	yesAnswer() {
		let preferedQuestions = this.questions.filter(q =>
			q.professions.some(p =>
				this.currentQuestion.professions.find(cp =>
					cp === p) !== undefined)
		);
		this.stack = this.stack.concat(preferedQuestions);
		this.questions = this.questions.filter(q => !preferedQuestions.some(pq => pq === q));
	}

	noAnswer() {
		this.professions = this.professions.filter(p =>
			!this.currentQuestion.professions.some(cqp =>
				cqp === p.id));

		this.questions = this.questions.filter(q =>
			q.professions.some(qp =>
				this.professions.some(p =>
					p.id === qp)));

		this.stack = this.stack.filter(q =>
			q.professions.some(qp =>
				this.professions.some(p =>
					p.id === qp)));
	}
}

module.exports = Expert;
