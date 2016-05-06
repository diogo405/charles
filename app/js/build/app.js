(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Audio = {

	success: $('audio#success')[0],
	error: $('audio#error')[0],
	levelUp: $('audio#levelUp')[0],
	background: $('audio#background')[0]
};

module.exports = Audio;
},{}],2:[function(require,module,exports){
var self;

function Char() {

	self = this;

	this.CHAR_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	this.CHAR_ARRAY_COMPLEMENT = ['!', '@', '#', '$', '%', '&', '*', '(', ')'];
	this.chars = $('.chars');
}

Char.prototype.show = function() {
	
	var newChar = get();
	
	self.chars.html(newChar);
	self.chars.addClass('move');
	self.chars.on('animationend webkitAnimationEnd', function(e){
		$(this).removeClass('move');			
		
		/*
		if (!keypressed) {
			// TODO: 
		}
		*/			
	}); 

	return newChar;

	function get() {
		return self.CHAR_ARRAY[Math.floor(Math.random() * self.CHAR_ARRAY.length)];
	}
};

module.exports = new Char();

},{}],3:[function(require,module,exports){
$(function(){

	var Audio = require('./audio.js');
	var InfoPanel = require('./info-panel.js');
	var Char = require('./char.js');
	 
	var NUMBER_OF_DANCES = 4; 
	//var CHAR_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	//var CHAR_ARRAY_COMPLEMENT = ['!', '@', '#', '$', '%', '&', '*', '(', ')'];
	var CORRECT_IN_ROW_FIRST = 3;
	var CORRECT_IN_ROW_SECOND = 8;
	var MESSAGE_ARRAY = ['Awesome!', 'Cooool', 'Very good :>', 'Let\'s dance!', 'Nice'];
	var ANIMATION_DURATION_ADJUST = 0.025;
	var $charles = $('#charles');
	//var $chars = $('.chars');
	var $body = $('body');
	var $message = $('.message');
	var $level = $('span.level');
	var $startMessage = $('.start-message');
	var $levelUp = $('.level-up');
	var correct = 0;
	var correctInRow = 0;
	var started = false;
	var level = 1;
	var newChar;
	var keypressed;	

	var changeLevel = function() {
		if (correct === 0 || correct % 7 !== 0) return;

		Audio.levelUp.play();
		level++;
		$level.html('L'+level);
		$levelUp.html('LEVEL '+level+'!');
		$levelUp.addClass('level');
		$levelUp.on('animationend webkitAnimationEnd', function(e){
			$(this).removeClass('level');
		});
		InfoPanel.updatePoints(level, InfoPanel.points.LEVEL);
		var $charsMove = $('.chars.move');
		console.log($charsMove);
		var animationDuration = parseFloat($charsMove.css('animation-duration'));
		console.log('animationDuration', animationDuration);
		animationDuration -= ANIMATION_DURATION_ADJUST;
		animationDuration = animationDuration < 0.3 ? 0.3 : animationDuration; 
		if (animationDuration == 0.3) {
			CHAR_ARRAY.concat(CHAR_ARRAY_COMPLEMENT);
		}
		console.log('animationDuration after', animationDuration);
		$charsMove.css({'animation-duration': animationDuration + 's'});
	};

	var showMessage = function() {
		if (correctInRow == CORRECT_IN_ROW_FIRST || correctInRow == CORRECT_IN_ROW_SECOND) {
			console.log('correctInRow', correctInRow);
			var points = correctInRow == CORRECT_IN_ROW_FIRST ? InfoPanel.points.IN_A_ROW_1 : InfoPanel.points.IN_A_ROW_2;
			InfoPanel.updatePoints(level, points);
			var text = getFromArray(MESSAGE_ARRAY);
			$message.html(text);
			$message.addClass('say');
			$message.on('animationend webkitAnimationEnd', function(e){
				$(this).removeClass('say');
			});
		}
	};

	var miss = function() {
		correctInRow = 0;			
		Audio.error.play();

		if (InfoPanel.isAlive()) {
			InfoPanel.updateLife();
		} else {
			gameOver(); 
		}

		$body.addClass('miss');
		setTimeout(function(){ $body.removeClass('miss'); }, 250);
	};

	/*
	var showChar = function() {
		newChar = getFromArray(CHAR_ARRAY);
		$chars.html(newChar);
		$chars.addClass('move');
		$chars.on('animationend webkitAnimationEnd', function(e){
			$(this).removeClass('move');			
			if (!keypressed) {
				//addPoints(-3);
				//miss();
				//$body.addClass('alert');
				//setTimeout(function(){ $body.removeClass('alert'); }, 250);
			}			
		}); 
	};
	*/

	var getFromArray = function(array) {
		return array[Math.floor(Math.random() * array.length)];
	};

	var dance = function() {
		setTimeout(function(){ 
			move();
			setTimeout(function(){
				move();
				setTimeout(function(){
					move();
					setTimeout(function(){
						move();
						setTimeout(function(){
							move();
						}, 250);
					}, 250);
				}, 250);
			},250);
		}, 250);
	};

	var move = function() {
		var currentDanceNumber = getCurrentDanceNumber();
		var nextDanceNumber = pickDanceNumber();

		while (currentDanceNumber == nextDanceNumber){
			nextDanceNumber = pickDanceNumber();
		}

		$charles.removeClass().addClass('dance'+nextDanceNumber);
	};

	var getCurrentDanceNumber = function() {
		var className = $charles.attr('class');
		if (!className) return 0;
		var re = /dance(\d*)/;
		return re.exec(className)[1];
	};

	var pickDanceNumber = function() {
		return Math.floor(Math.random() * NUMBER_OF_DANCES + 1);
	};

	var gameOver = function() {
		started = false;
		$body.addClass('game-over');
		Audio.background.currentTime = 0;
		$body.off('keypress');

		$('.game-over .blur, .game-over .game-over-message').on('click', function(){		
			//started = false;
			//$startMessage.show();
			//start();
		});
	}; 
 
	var start = function() {
		$level.show();
		$level.html('L1');
		Audio.background.play();
		$body.removeClass('game-over');
		InfoPanel.init();
 
		setInterval(function(){ newChar = Char.show(); }, 1000);
 
		$body.on('keypress', function(e){
			var charCode = e.which || e.keyCode;
			keypressed = String.fromCharCode(charCode);
			if (keypressed && newChar && keypressed.toUpperCase() == newChar.toUpperCase()) {
				Audio.success.play();
				correctInRow++;
				showMessage();
				correct++;
				InfoPanel.updatePoints(level);
				changeLevel();
				dance();
				keypressed = undefined;
			} else {	
				miss();
			}			
		}); 
	};
 
	$body.on('keypress', function(){
		if (started) return;
		$startMessage.hide();
		start();			
		started = true;
	});

});
},{"./audio.js":1,"./char.js":2,"./info-panel.js":4}],4:[function(require,module,exports){
var self;

function InfoPanel() {
	
	self = this;

	this.NUMBER_OF_LIFES = 4;
	
	this.lifeBar = $('.life-bar');
	this.score = $('.score');
	this.scorePoints = 0;
	
	this.points = { 
		CHAR: 18, 
		LEVEL: 664, 
		IN_A_ROW_1: 164,
		IN_A_ROW_2: 477
	};
}

InfoPanel.prototype.init = function() {

	initLife();
	self.score.show();

	function initLife() {
		for (var i = 0; i < self.NUMBER_OF_LIFES; i++) {
			var div = document.createElement('div');
			div.className = 'life';
			self.lifeBar.append(div);		
		}
	}
};

InfoPanel.prototype.updateLife = function() {
	self.lifeBar.find('.life:first').remove();
};

InfoPanel.prototype.isAlive = function() {
	return self.lifeBar.find('.life:first').length > 0;
};

InfoPanel.prototype.updatePoints = function(level, points) {

	self.scorePoints = points ? 
		self.scorePoints + points * level : 
		self.scorePoints + self.points.CHAR * level;

	self.score.html(self.scorePoints);
};

module.exports = new InfoPanel();
},{}]},{},[3])