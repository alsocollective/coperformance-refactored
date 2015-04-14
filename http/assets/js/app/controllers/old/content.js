var j = 0;

document.addEventListener("DOMContentLoaded", function() {

	console.log("Content JS Init");

	var element = document.getElementById("main");

	for (i = 0; i < 10; i++) {
		var d = document.createElement("img");
		element.appendChild(d);
		d.style.visibility = "hidden";
		d.src = "/../../content/song-4/s4-" + i + ".png";
		d.id = "s4-" + i;
	}

	var myVar = setInterval(function() {
		myTimer()
	}, 150);

	function myTimer() {

		if (j < 9) {
			j++
		} else if (j === 9) {
			j = 0;
		}

		console.log(j);

		document.getElementById(("s4-" + j).toString()).style.visibility = "hidden";

		// document.getElementById("hrs").innerHTML = ("h: "+j).toString();

		if (j + 1 === 10) {
			// console.log("NOPE!");
			document.getElementById(("s4-0").toString()).style.visibility = "visible";
		} else {
			document.getElementById(("s4-" + (j + 1)).toString()).style.visibility = "visible";
		}
	}

});