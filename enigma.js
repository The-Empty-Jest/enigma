function initialize(){
	alphabet = ["A", "B", "C", "D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

	//Constants for different rotor settings.
	I = ["E", "K", "M", "F", "L", "G", "D", "Q", "V", "Z", "N", "T", "O", "W", "Y", "H", "X", "U", "S", "P", "A", "I", "B", "R", "C", "J"];
	II = ["A", "J", "D", "K", "S", "I", "R", "U", "X", "B", "L", "H", "W", "T", "M", "C", "Q", "G", "Z", "N", "P", "Y", "F", "V", "O", "E"];
	III = ["B","D","F","H","J","L","C","P","R","T","X","V","Z","N","Y","E","I","W","G","A","K","M","U","S","Q","O"];
	IV = ["E", "S", "O", "V", "P", "Z", "J", "A", "Y", "Q", "U", "I", "R", "H", "X", "L", "N", "F", "T", "G", "K", "D", "C", "M", "W", "B"];
	V = ["V", "Z", "B", "R", "G", "I", "T", "Y", "U", "P", "S", "D", "N", "H", "L", "X", "A", "W", "M", "J", "Q", "O", "F", "E", "C", "K"];
	settings = [I, II, III, IV, V];

	reflector = ["Y", "R", "U", "H", "Q", "S", "L", "D", "P", "X", "N", "G", "O", "K", "M", "I", "E", "B", "F", "Z", "C", "W", "V", "J", "A", "T"];

	plugboard = alphabet.slice(0);

	//Constants for when rotor causes next rotor to shift. 0 = forwards, 1 = reverse
	iKicks = ["R", "Q"];
	iiKicks = ["F", "E"];
	iiiKicks = ["W", "V"]
	ivKicks = ["K", "J"];
	vKicks = ["A", "Z"];
	kickSettings = [iKicks, iiKicks, iiiKicks, ivKicks, vKicks];

	//Outer Rotors initially same as alphabet //slice is used to return a copy of the array rather than the array itself.
	rotorRightOuter = alphabet.slice(0);
	rotorMiddleOuter = alphabet.slice(0);
	rotorLeftOuter = alphabet.slice(0);

	//Default Settings for Inner Rotors
	rotorRightInner = III.slice(0);
	rotorMiddleInner = II.slice(0);
	rotorLeftInner = I.slice(0);

	//Default values for when a rotor causes next rotor to shift.
	rightRotorKick = iiiKicks[0];
	rightRotorReverseKick = iiiKicks[1];
	middleRotorKick = iiKicks[0];
	middleRotorReverseKick = iiKicks[1];

	//Values for current user-selected rotor setttings
	cRotorRightOuter = alphabet.slice(0);
	cRotorMiddleOuter = alphabet.slice(0);
	cRotorLeftOuter = alphabet.slice(0);

	cRotorRightInner = III.slice(0);
	cRotorMiddleInner = II.slice(0);
	cRotorLeftInner = I.slice(0);

	cRightRotorKick = iiiKicks[0];
	cRightRotorReverseKick = iiiKicks[1];
	cMiddleRotorKick = iiKicks[0];
	cMiddleRotorReverseKick = iiKicks[1];

	//String storing encoded value;
	encodedString = "";

	oldInputLength = 0;
	input = document.getElementById("input");
	result = document.getElementById("newLet");
	rotor1 = document.getElementById("rotor1");
	rotor2 = document.getElementById("rotor2");
	rotor3 = document.getElementById("rotor3");
	lights = document.getElementsByClassName("light");
	bulbToLight = "";

	input.oninput = inputText;

	shiftButtons = document.getElementsByClassName("shiftButtons");

	rotorSettingsSelectors = document.getElementsByClassName("rotorsettings");

	plugDiv = document.getElementById("plugboard");
	plugDiv.onkeyup = changePlugboard;
	plugDiv.onkeydown = clear;
	plugDiv.onclick = clear;
	plugDiv.onmouseout = setPlugboard;
	plugboardSettings = document.getElementsByClassName("pbs");

}

inputText = function(){
	input.value = input.value.replace(/[^A-Z]/ig, "");
	encodedString = enigmaWord(input.value.toUpperCase());
	bulbToLight = encodedString.charAt(encodedString.length - 1);
	display();

	if(input.value != ""){
		for (var i = 0; i < 3; i++) {
			rotorSettingsSelectors[i].style.opacity = "0.3";
			rotorSettingsSelectors[i].disabled = true;
		}

		for(var i = 0; i < 6; i++){
			shiftButtons[i].style.opacity = "0.3";
			shiftButtons[i].style.cursor = "default";
		}

		plugDiv.style.display = "none";
	}else{
		for (var i = 0; i < 3; i++) {
			rotorSettingsSelectors[i].style.opacity = "1";
			rotorSettingsSelectors[i].disabled = false;
		}

		for(var i = 0; i < 6; i++){
			shiftButtons[i].style.opacity = "1";
			shiftButtons[i].style.cursor = "pointer";
		}

		plugDiv.style.display = "initial";
	}
}

clear = function(event){
	plugboard[event.target.value.charCodeAt(0) - 65] = event.target.value;
	plugboard[Array.prototype.indexOf.call(plugboardSettings, event.target)] = alphabet[Array.prototype.indexOf.call(plugboardSettings, event.target)]
	window.setPlugboard();
	event.target.value = "";
}

changePlugboard = function(event){
	console.log(event.keyCode);
	letter1position = Array.prototype.indexOf.call(plugboardSettings, event.target);
	letter2position = event.keyCode - 65;

	plugboard[letter1position] = alphabet[letter2position];
	plugboard[letter2position] = alphabet[letter1position];

	window.setPlugboard();
}

setPlugboard = function(event){
	for(var i = 0; i < plugboardSettings.length; i++){
		plugboardSettings[i].value = plugboard[i];
	}
}

function shiftLeft(rotor){
	rotor.push(rotor.shift());
}

function shiftRight(rotor){
	rotor.unshift(rotor.pop());
}

function map(letter, rotorFrom, rotorTo){
	return rotorTo[rotorFrom.indexOf(letter)];
}

function pass(letter){
	shift("right");
	if(rotorRightOuter[0] == rightRotorKick){
		shift("middle");

		if(rotorMiddleOuter[0] == middleRotorKick){
			shift("left");
		}
	}
	if(rotorMiddleOuter[0] == middleRotorReverseKick){
		shift("middle");
		shift("left");
	}
	letter = map(letter, plugboard, rotorRightInner);
	letter = map(letter, rotorRightOuter, rotorMiddleInner);
	letter = map(letter, rotorMiddleOuter, rotorLeftInner);
	return letter;
}

function reflect(letter){
	letter = map(letter, rotorLeftOuter, alphabet);
	letter = map(letter, alphabet, reflector);
	letter = map(letter, alphabet, rotorLeftOuter);
	return letter;
}

function passReverse(letter){
	letter = map(letter, rotorLeftInner, rotorMiddleOuter);
	letter = map(letter, rotorMiddleInner, rotorRightOuter);
	letter = map(letter, rotorRightInner, plugboard);
	return letter;
}

function shift(rotor){
	switch(rotor){
		case "right":
			shiftLeft(rotorRightOuter);
			shiftLeft(rotorRightInner);
			break;

		case "middle":
			shiftLeft(rotorMiddleOuter);
			shiftLeft(rotorMiddleInner);
			break;

		case "left":
			shiftLeft(rotorLeftOuter);
			shiftLeft(rotorLeftInner);
			break;
	}
	display();
}

function shiftCurrent(rotor){
	if(input.value != ""){
		return;
	}
	switch(rotor){
		case "right":
			shiftLeft(cRotorRightOuter);
			shiftLeft(cRotorRightInner);
			shift("right");
			break;

		case "middle":
			shiftLeft(cRotorMiddleOuter);
			shiftLeft(cRotorMiddleInner);
			shift("middle");
			break;

		case "left":
			shiftLeft(cRotorLeftOuter);
			shiftLeft(cRotorLeftInner);
			shift("left");
			break;
	}
	display();
}

function reverseShiftCurrent(rotor){
	if(input.value != ""){
		return;
	}
	switch(rotor){
		case "right":
			shiftRight(cRotorRightOuter);
			shiftRight(cRotorRightInner);

			shiftRight(rotorRightOuter);
			shiftRight(rotorRightInner);
			break;

		case "middle":
			shiftRight(cRotorMiddleOuter);
			shiftRight(cRotorMiddleInner);

			shiftRight(rotorMiddleOuter);
			shiftRight(rotorMiddleInner);
			break;

		case "left":
			shiftRight(cRotorLeftOuter);
			shiftRight(cRotorLeftInner);

			shiftRight(rotorLeftOuter);
			shiftRight(rotorLeftInner);
			break;
	}
	display();
}

function setRotors(){
	var leftSetting = parseInt(rotorSettingsSelectors[0].value);
	var middleSetting = parseInt(rotorSettingsSelectors[1].value);
	var rightSetting = parseInt(rotorSettingsSelectors[2].value)

	cRotorLeftInner = settings[leftSetting].slice(0);
	for(var i = 65; i < cRotorLeftOuter[0].charCodeAt(0); i++){
		shiftLeft(cRotorLeftInner);
	}
	
	cRotorMiddleInner = settings[middleSetting].slice(0);
	cMiddleRotorKick = kickSettings[middleSetting][0];
	cMiddleRotorReverseKick = kickSettings[middleSetting][1];
	for(var i = 65; i < cRotorMiddleOuter[0].charCodeAt(0); i++){
		shiftLeft(cRotorMiddleInner);
	}
	
	cRotorRightInner = settings[rightSetting].slice(0);
	cRightRotorKick = kickSettings[rightSetting][0];
	cRightRotorReverseKick = kickSettings[rightSetting][1];
	for(var i = 65; i < cRotorRightOuter[0].charCodeAt(0); i++){
		shiftLeft(cRotorRightInner);
	}

	console.log(rotorLeftInner);
	console.log(rotorMiddleInner);
	console.log(rotorRightInner);
}

function setCurrent(){
	rotorLeftOuter = cRotorLeftOuter.slice(0);
	rotorLeftInner = cRotorLeftInner.slice(0);

	rotorMiddleOuter = cRotorMiddleOuter.slice(0);
	rotorMiddleInner = cRotorMiddleInner.slice(0);

	rotorRightOuter = cRotorRightOuter.slice(0);
	rotorRightInner = cRotorRightInner.slice(0);

	rightRotorKick = cRightRotorKick;
	rightRotorReverseKick = cRightRotorReverseKick;

	middleRotorKick = cMiddleRotorKick;
	middleRotorReverseKick = cMiddleRotorReverseKick;
}

function enigma(letter){
	if(/[^A-Z]/ig.test(letter)){
		return "";
	}
	return passReverse(reflect(pass(letter)));
}

function run(letter){
	input.value += letter;
	window.inputText();
}

function enigmaWord(word){
	setCurrent();
	var cypherText = "";
	for(var i = 0; i < word.length; i++){
		cypherText += enigma(word[i]);
	}
	return cypherText;
}

function display(){
	rotor1.innerHTML = rotorLeftOuter[0];
	rotor2.innerHTML = rotorMiddleOuter[0];
	rotor3.innerHTML = rotorRightOuter[0];

	result.innerHTML = "OUTPUT: " + encodedString;

	for(var i = 0; i < lights.length; i++){
		if(lights[i].innerHTML == bulbToLight){
			lights[i].style.backgroundColor = "#c6c639";
		}else{
			lights[i].style.backgroundColor = "#505050";
		}
	}
}

function clearInput(){
	input.value = "";
	window.inputText();
}