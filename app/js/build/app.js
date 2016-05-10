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

function CharEngine() {

	self = this;

	this.CHAR_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	this.CHAR_ARRAY_COMPLEMENT = ['!', '@', '#', '$', '%', '&', '*', '(', ')'];
	this.ANIMATION_DURATION_ADJUST = 0.025;

	this.chars = $('.chars');
}

CharEngine.prototype.show = function() {
	
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


CharEngine.prototype.updateSpeed = function() {
	var $charsMove = $('.chars.move');
	var animationDuration = parseFloat($charsMove.css('animation-duration'));
	animationDuration -= self.ANIMATION_DURATION_ADJUST;
	animationDuration = animationDuration < 0.3 ? 0.3 : animationDuration; 
	if (animationDuration == 0.3) {
		self.CHAR_ARRAY.concat(self.CHAR_ARRAY_COMPLEMENT);
	}
	$charsMove.css({'animation-duration': animationDuration + 's'});
};

module.exports = new CharEngine();

},{}],3:[function(require,module,exports){
var InfoPanel = require('./info-panel');

var self;

function Charles() {
	
	self = this;

	this.MESSAGE_ARRAY = ['Awesome!', 'Cooool', 'Very good :>', 'Let\'s dance!', 'Nice', 'Wow', ':)))', 'Follow me!', 'Like Jackson!'];
	this.NUMBER_OF_DANCES = 4;
	this.CORRECT_IN_ROW_FIRST = 3;
	this.CORRECT_IN_ROW_SECOND = 8;

	this.toy = $('#charles');
	this.message = $('.message');
	this.shirt = $('.body');
}

Charles.prototype.dance = function() {

	setTimeout(function(){ 
		self.move();
		setTimeout(function(){
			self.move();
			setTimeout(function(){
				self.move();
				setTimeout(function(){
					self.move();
					setTimeout(function(){
						self.move();
					}, 250);
				}, 250);
			}, 250);
		},250);
	}, 250);

};

Charles.prototype.move = function() {
	var currentDanceNumber = getCurrentDanceNumber();
	var nextDanceNumber = pickDanceNumber();

	while (currentDanceNumber == nextDanceNumber){
		nextDanceNumber = pickDanceNumber();
	}

	self.toy.removeClass().addClass('dance'+nextDanceNumber);

	function getCurrentDanceNumber() {
		var className = self.toy.attr('class');
		if (!className) return 0;
		var re = /dance(\d*)/;
		return re.exec(className)[1];
	}

	function pickDanceNumber() {
		return Math.floor(Math.random() * self.NUMBER_OF_DANCES + 1);
	}
};

Charles.prototype.claim = function(correctInRow, level) {
	if (correctInRow == self.CORRECT_IN_ROW_FIRST || self.correctInRow == self.CORRECT_IN_ROW_SECOND) {
		var points = correctInRow == self.CORRECT_IN_ROW_FIRST ? InfoPanel.points.IN_A_ROW_1 : InfoPanel.points.IN_A_ROW_2;
		InfoPanel.updatePoints(level, points);
		var text = getText();
		self.message.html(text);
		self.message.addClass('say');
		self.message.on('animationend webkitAnimationEnd', function(e){
			$(this).removeClass('say');
		});
	}

	function getText() {
		return self.MESSAGE_ARRAY[Math.floor(Math.random() * self.MESSAGE_ARRAY.length)];	
	}
};

Charles.prototype.removeShirt = function() {
	self.shirt.addClass('naked');
};

module.exports = new Charles();
},{"./info-panel":5}],4:[function(require,module,exports){
$(function(){

	var Audio = require('./audio.js');
	var InfoPanel = require('./info-panel.js');
	var CharEngine = require('./char-engine.js');
	var Charles = require('./charles.js');
	var LevelController = require('./level-controller.js');
	 
	var self;

	function Game() {
		
		self = this;

		this.correct = 0;
		this.correctInRow = 0;
		this.started = false;
		this.newChar = null;
		this.keypressed = null;
		
		this.body = $('body');
		this.startMessage = $('.start-message');

		self.body.on('keypress', function(e){

			if (!self.started) {
				self.startMessage.hide();
				self.start();			
				self.started = true;
				return;
			}

			var charCode = e.which || e.keyCode;
			self.keypressed = String.fromCharCode(charCode);
			if (self.keypressed && self.newChar && self.keypressed.toUpperCase() == self.newChar.toUpperCase()) {
				self.success();
			} else {	
				self.miss();
			}			
		});
	}

	// -- Starts here ---
	new Game();

	Game.prototype.start = function() {
		Audio.background.play();
		InfoPanel.init();
		setInterval(function(){ self.newChar = CharEngine.show(); }, 1000);
	};

	Game.prototype.success = function() {
		Audio.success.play();
		self.correctInRow++;
		Charles.claim(self.correctInRow, LevelController.level);
		self.correct++;
		InfoPanel.updatePoints(LevelController.level);
		self.changeLevel();
		Charles.dance();
		self.keypressed = null; // TODO: review
	};

	Game.prototype.miss = function() {
		self.correctInRow = 0;			
		Audio.error.play();

		if (InfoPanel.isAlive()) {
			InfoPanel.updateLife();
			if (InfoPanel.getLife() === 0) {
				Charles.removeShirt();				
			}
		} else {
			self.gameOver(); 
		}

		self.body.addClass('miss');
		setTimeout(function(){ self.body.removeClass('miss'); }, 250);
	};

	Game.prototype.changeLevel = function() {

		if (self.correct === 0 || self.correct % 7 !== 0) {
			return;
		}

		Audio.levelUp.play();
		LevelController.level++;
		InfoPanel.updateLevel(LevelController.level);
		LevelController.showLevelUp();
		InfoPanel.updatePoints(LevelController.level, InfoPanel.points.LEVEL);
		CharEngine.updateSpeed();
	};

	Game.prototype.gameOver = function() {
		self.started = false;
		self.body.addClass('game-over');
		Audio.background.currentTime = 0;
		self.body.off('keypress');

		$('.game-over .blur, .game-over .game-over-message').on('click', function() {
			// TODO
		});
	};

});
},{"./audio.js":1,"./char-engine.js":2,"./charles.js":3,"./info-panel.js":5,"./level-controller.js":6}],5:[function(require,module,exports){
var self;

function InfoPanel() {
	
	self = this;

	this.NUMBER_OF_LIFES = 4;
	
	this.lifeBar = $('.life-bar');
	this.score = $('.score');
	this.scorePoints = 0;
	this.level = $('span.level');
	
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
	self.level.html('L1');
	self.level.show();

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

InfoPanel.prototype.updateLevel = function(level) {
	self.level.html('L'+level);
};

InfoPanel.prototype.isAlive = function() {
	return self.lifeBar.find('.life:first').length > 0;
};


InfoPanel.prototype.getLife = function() {
	return self.lifeBar.find('.life:first').length;
};

InfoPanel.prototype.updatePoints = function(level, points) {

	self.scorePoints = points ? 
		self.scorePoints + points * level : 
		self.scorePoints + self.points.CHAR * level;

	self.score.html(self.scorePoints);
};

module.exports = new InfoPanel();
},{}],6:[function(require,module,exports){
var self;

function LevelController() {

	self = this;
	this.level = 1;

	this.levelUp = $('.level-up');
}

LevelController.prototype.showLevelUp = function() {
	self.levelUp.html('LEVEL '+self.level+'!');
	self.levelUp.addClass('level');
	self.levelUp.on('animationend webkitAnimationEnd', function(e){
		$(this).removeClass('level');
	});
};

module.exports = new LevelController();
},{}]},{},[4])