var xhr = new XMLHttpRequest();

var question = document.querySelector(".pe--form--question");

question.addEventListener('transitionend', function () {
	let res = JSON.parse(this.responseText);
	if(res.type === "answer") {
		document.forms[0].innerHTML = "Вы: " + (res.professions.length ? res.professions.join(", ") : "никто");
	} else {
		question.innerHTML = res.question;
	}
	question.classList.remove("opacity");
}.bind(xhr));

function giveAnswer(answer) {
	if(question.classList.contains("opacity"))
		return;
	xhr.open("GET", "/answer/" + answer, true);
	xhr.onload = function () {
		question.classList.add("opacity");
	};
	xhr.send('');
}