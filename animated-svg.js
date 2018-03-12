var email = document.querySelector('#login-email'), 
		password = document.querySelector('#login-senha'), 
		mySVG = document.querySelector('.svgContainer'), 
		armL = document.querySelector('.armL'), 
		armR = document.querySelector('.armR'), 
		eyeL = document.querySelector('.eyeL'), 
		eyeR = document.querySelector('.eyeR'), 
		nose = document.querySelector('.nose'), 
		mouth = document.querySelector('.mouth'), 
		mouthBG = document.querySelector('.mouthBG'), 
		mouthSmallBG = document.querySelector('.mouthSmallBG'), 
		mouthMediumBG = document.querySelector('.mouthMediumBG'), 
		mouthLargeBG = document.querySelector('.mouthLargeBG'), 
		mouthMaskPath = document.querySelector('#mouthMaskPath'), 
		mouthOutline = document.querySelector('.mouthOutline'), 
		tooth = document.querySelector('.tooth'), 
		tongue = document.querySelector('.tongue'), 
		chin = document.querySelector('.chin'), 
		face = document.querySelector('.face'), 
		eyebrow = document.querySelector('.eyebrow'), 
		outerEarL = document.querySelector('.earL .outerEar'), 
		outerEarR = document.querySelector('.earR .outerEar'), 
		earHairL = document.querySelector('.earL .earHair'), 
		earHairR = document.querySelector('.earR .earHair'), 
		hair = document.querySelector('.hair');
var caretPos, 
		curEmailIndex, 
		screenCenter, 
		svgCoords, 
		eyeMaxHorizD = 20, 
		eyeMaxVertD = 10, 
		noseMaxHorizD = 23, 
		noseMaxVertD = 10, 
		dFromC, 
		eyeLDistV, 
		eyeRDistV, 
		eyeDistR, 
		mouthStatus = "small",
		eyeScale = 1;

function getCoord() {
	var div = document.createElement('div'), // elemento para poder pegar o offset do texto digitado no campo de input
			span = document.createElement('span'), // elemento para servir de referencia para pegar o offset do texto digitado
			emailCoords = {}, caretCoords = {}, centerCoords = {};

	document.body.appendChild(div); // adiciona a div ao corpo do html
	div.textContent = email.value; // texto do campo input de email
	div.appendChild(span); // adiciona o span logo após o texto para pegar a distância entre o span e a div
	
	// posição do input de email
	emailCoords = getPosition(email);							//console.log("emailCoords.x: " + emailCoords.x + ", emailCoords.y: " + emailCoords.y);
	// posição do deslocamento causado pela digitação do texto no campo de input
	caretCoords = getPosition(span);							//console.log("caretCoords.x " + caretCoords.x + ", caretCoords.y: " + caretCoords.y);
	// posição do SVG
	centerCoords = getPosition(mySVG);						//console.log("centerCoords.x: " + centerCoords.x);
	svgCoords = getPosition(mySVG);
	// centro do SVG, posição x inicial mais o tamanho do svg dividido por 2
	screenCenter = centerCoords.x + (mySVG.offsetWidth / 2);		//console.log("screenCenter: " + screenCenter);
	// posição do campo de email mais o espaço que o texto do input ocupa
	caretPos = caretCoords.x + emailCoords.x;					//console.log("caretPos: " + caretPos);
	// distância do centro do SVG menos o total do campo de email + texto
	dFromC = screenCenter - caretPos; 								//console.log("dFromC: " + dFromC);

	// posiciona os elementos SVG na tela
	var eyeLCoords = {x: svgCoords.x + 84, y: svgCoords.y + 76};
	var eyeRCoords = {x: svgCoords.x + 113, y: svgCoords.y + 76};
	var noseCoords = {x: svgCoords.x + 97, y: svgCoords.y + 81};
	var mouthCoords = {x: svgCoords.x + 100, y: svgCoords.y + 100};
	var eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var eyeLX = Math.cos(eyeLAngle) * eyeMaxHorizD;
	var eyeLY = Math.sin(eyeLAngle) * eyeMaxVertD;
	var eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var eyeRX = Math.cos(eyeRAngle) * eyeMaxHorizD;
	var eyeRY = Math.sin(eyeRAngle) * eyeMaxVertD;
	var noseAngle = getAngle(noseCoords.x, noseCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var noseX = Math.cos(noseAngle) * noseMaxHorizD;
	var noseY = Math.sin(noseAngle) * noseMaxVertD;
	var mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
	var mouthX = Math.cos(mouthAngle) * noseMaxHorizD;
	var mouthY = Math.sin(mouthAngle) * noseMaxVertD;
	var mouthR = Math.cos(mouthAngle) * 6;
	var chinX = mouthX * .8;
	var chinY = mouthY * .5;
	//var chinS = 1 - ((dFromC * .15) / 100);
	//if(chinS > 1) {chinS = 1 - (chinS - 1);}
	var faceX = mouthX * .3;
	var faceY = mouthY * .4;
	var faceSkew = Math.cos(mouthAngle) * 5;
	var eyebrowSkew = Math.cos(mouthAngle) * 5;
	var outerEarX = Math.cos(mouthAngle) * 4;
	var outerEarY = Math.cos(mouthAngle) * 5;
	var hairX = Math.cos(mouthAngle) * 6;
	var hairS = 1.2;
	var duration = 1000;

	anime({ targets: eyeL, duration: duration, translateX: -eyeLX, translateY: -eyeLY, easing: 'easeOutExpo' });
	anime({ targets: eyeR, duration: duration, translateX: -eyeRX, translateY: -eyeRY, easing: 'easeOutExpo' });
	anime({ targets: nose, duration: duration, translateX: -noseX, translateY: -noseY, rotation: mouthR, transformOrigin: "50% 50% 0", easing: 'easeOutExpo' });
	anime({ targets: mouth, duration: duration, translateX: -mouthX, translateY: -mouthY, rotation: mouthR, transformOrigin: "50% 50% 0", easing: 'easeOutExpo' });
	anime({ targets: chin, duration: duration, translateX: -chinX, translateY: -chinY, easing: 'easeOutExpo' });
	anime({ targets: face, duration: duration, translateX: -faceX, translateY: -faceY, skewX: -faceSkew, transformOrigin: "50% 0% 0", easing: 'easeOutExpo' }); 
	anime({ targets: eyebrow, duration: duration, translateX: -faceX, translateY: -faceY, skewX: -eyebrowSkew, transformOrigin: "50% 0% 0", easing: 'easeOutExpo' });
	anime({ targets: outerEarL, duration: duration, translateX: outerEarX, translateY: -outerEarY, easing: 'easeOutExpo' });
	anime({ targets: outerEarR, duration: duration, translateX: outerEarX, translateY: outerEarY, easing: 'easeOutExpo' });
	anime({ targets: earHairL, duration: duration, translateX: -outerEarX, translateY: -outerEarY, easing: 'easeOutExpo' });
	anime({ targets: earHairR, duration: duration, translateX: -outerEarX, translateY: outerEarY, easing: 'easeOutExpo' });
	anime({ targets: hair, duration: duration, translateX: hairX, easing: 'easeOutExpo' });
	
	document.body.removeChild(div);
};

function onEmailInput(e) {
	getCoord();
	var duration = 1000;
	var value = e.target.value;
	var curEmailIndex = value.length;
	// very crude email validation for now to trigger effects
	if(curEmailIndex > 0) {
		mouthStatus = "medium";
		anime({ targets: [mouthBG, mouthOutline, mouthMaskPath], d: mouthMediumBG.getAttribute('d'), easing: 'easeOutExpo' });
		anime({ targets: tooth, duration: duration, translateX: 0, translateY: 0, easing: 'easeOutExpo' });
		anime({ targets: tongue, duration: duration, translateX: 0, translateY: 1, easing: 'easeOutExpo' });
	} 
}

function onEmailFocus(e) {
	getCoord();
}

function onEmailBlur(e) {
	resetFace();
}

function onPasswordFocus(e) {
	coverEyes();
}

function onPasswordBlur(e) {
	uncoverEyes();
}

function coverEyes() {
	anime({
		targets: [armL, armR],
	  duration: 450,
	  translateX: -93,
	  translateY: 2,
	  rotation: 0,
	  easing: 'easeOutQuad'
	});
}

function uncoverEyes() {
	anime({
		targets: [armL, armR],
	  duration: 1350,
	  translateX: -93,
	  translateY: 220,
	  easing: 'easeOutQuad'
	});
}

function resetFace() {
	var duration = 1000;
	anime({ targets: [eyeL, eyeR, nose, chin, outerEarL, outerEarR, earHairL, earHairR, hair], duration: duration, translateX: 0, translateY: 0, easing: 'easeOutExpo' });
	anime({ targets: mouth, duration: duration, translateX: 0, translateY: 0, rotation: 0, easing: 'easeOutExpo' });
	anime({ targets: [face, eyebrow], duration: duration, translateX: 0, translateY: 0, skewX: 0, easing: 'easeOutExpo' });
}

function getAngle(x1, y1, x2, y2) {
	var angle = Math.atan2(y1 - y2, x1 - x2);
	return angle;
}

// pega a posição x e y do elemento
function getPosition(el) {
	var xPos = 0;
	var yPos = 0;

	// itera pelo elemento e os seus elementos pai para pegar a posição correta
	while (el) {
		// soma as quantidades da distância entre o elemento e o seu elemento pai
		if (el.tagName == "BODY") {
			// deal with browser quirks with body/window/document and page scroll
			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += (el.offsetLeft - xScroll + el.clientLeft);
			yPos += (el.offsetTop - yScroll + el.clientTop);
		} else {
			// for all other non-BODY elements
			xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			yPos += (el.offsetTop - el.scrollTop + el.clientTop);
		}
		// itera pelo próximo elemento pai
		el = el.offsetParent;
	}

	// retorna um objeto com as posições
	return {
		x: xPos,
		y: yPos
	};
}

email.addEventListener('focus', onEmailFocus);
email.addEventListener('blur', onEmailBlur);
email.addEventListener('input', onEmailInput);
password.addEventListener('focus', onPasswordFocus);
password.addEventListener('blur', onPasswordBlur);

// esconde os braços
anime({
	targets: [armL, armR],
  translateX: -93,
  translateY: 220,
  rotate: 105
});