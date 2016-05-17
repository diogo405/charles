(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
		this.isGameOver = false;
		this.newChar = null;
		this.keypressed = null;
		
		this.game = $('.gameBackground');
		this.gameOverBackground = $('.gameOverBackground');
		this.gameOverMessage = $('.gameOverMessage');
		this.continueMessage = $('.gameOverMessage-continue');
		this.startMessage = $('.messagePanel-startGameMessage');


		self.game.on('keypress', function(e){

			if (!self.started) {
				self.startMessage.hide();
				self.start();			
				self.started = true;
				return;
			}

			var charCode = e.which || e.keyCode;
			self.keypressed = String.fromCharCode(charCode);

			if (self.isGameOver) {

				if (self.keypressed && self.keypressed.toUpperCase() === 'C') {
					location.reload();
				}
				
				return;
			}

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
		setInterval(function(){ self.newChar = CharEngine.show(); }, 1150);
	};

	Game.prototype.success = function() {
		Audio.success.play();
		self.correctInRow++;
		Charles.claim(self.correctInRow, LevelController.level);
		self.correct++;
		var earnedPoints = InfoPanel.updatePoints(LevelController.level);
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

		self.game.addClass('gameBackground-isMiss');
		setTimeout(function(){ self.game.removeClass('gameBackground-isMiss'); }, 250);
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
		self.gameOverBackground.show();
		self.gameOverMessage.show();
		Audio.background.currentTime = 0;
		self.isGameOver = true;
	};
});
},{"./audio.js":2,"./char-engine.js":3,"./charles.js":4,"./info-panel.js":6,"./level-controller.js":7}],2:[function(require,module,exports){
var Audio = {

	success: $('audio#success')[0],
	error: $('audio#error')[0],
	levelUp: $('audio#levelUp')[0],
	background: $('audio#background')[0]
};

module.exports = Audio;
},{}],3:[function(require,module,exports){
var self;

function CharEngine() {

	self = this;

	this.CHAR_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	this.CHAR_ARRAY_COMPLEMENT = ['!', '@', '#', '$', '%', '&', '*', '(', ')'];
	this.ANIMATION_DURATION_ADJUST = 0.025;

	this.chars = $('.charEngine');

	this.newChar;
}

CharEngine.prototype.show = function() {
	
	self.newChar = get();
	
	self.chars.html(self.newChar);
	self.chars.addClass('charEngine-isWorking');
	self.chars.on('animationend webkitAnimationEnd', function(e){
		$(this).removeClass('charEngine-isWorking');			
		
		/*
		if (!keypressed) {
			// TODO: 
		}
		*/			
	}); 

	return self.newChar;

	function get() {
		return self.CHAR_ARRAY[Math.floor(Math.random() * self.CHAR_ARRAY.length)];
	}
};

CharEngine.prototype.getCurrentChar = function() {
	return self.newChar;
};

CharEngine.prototype.updateSpeed = function() {
	var $charsMoving = $('.charEngine.charEngine-isWorking');
	var animationDuration = parseFloat($charsMoving.css('animation-duration'));
	animationDuration -= self.ANIMATION_DURATION_ADJUST;
	animationDuration = animationDuration < 0.3 ? 0.3 : animationDuration; 
	if (animationDuration == 0.3) {
		self.CHAR_ARRAY.concat(self.CHAR_ARRAY_COMPLEMENT);
	}
	$charsMoving.css({'animation-duration': animationDuration + 's'});
};

module.exports = new CharEngine();

},{}],4:[function(require,module,exports){
var InfoPanel = require('./info-panel');
var Game = require('./app.js');

var self;

function Charles() {
	
	self = this;

	this.MESSAGE_ARRAY = ['Awesome!', 'Cooool', 'Very good :>', 'Let\'s dance!', 'Nice', 'Wow', ':)))', 'Follow me!', 'Like Jackson!'];
	this.NUMBER_OF_DANCES = 5;
	this.CORRECT_IN_ROW_FIRST = 3;
	this.CORRECT_IN_ROW_SECOND = 8;
	this.HAIR_HEIGHT_ADJUSTMENT = 3;
	this.TURN_BLACK_HAIR_HEIGHT = 60;

	this.toy = $('.charles');
	this.message = $('.charlesMessage');
	this.shirt = $('.charlesBody');
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
 
 	var currentClasses = self.toy.attr('class');
 	currentClasses = currentClasses.replace(/charles-dance(\d*)/g, '');
 	self.toy.attr('class', currentClasses + ' charles-dance'+nextDanceNumber);

	function getCurrentDanceNumber() {
		var className = self.toy.attr('class');
		if (className.indexOf('dance') < 0) return 0;
		var re = /charles-dance(\d*)/;
		return re.exec(className)[1];
	} 

	function pickDanceNumber() {
		return Math.floor(Math.random() * self.NUMBER_OF_DANCES + 1);
	}
};

Charles.prototype.claim = function(correctInRow, level) {
	
	if ((correctInRow !== 0) && ((correctInRow % self.CORRECT_IN_ROW_FIRST === 0) || (self.correctInRow % self.CORRECT_IN_ROW_SECOND === 0))) {
		var points = correctInRow == self.CORRECT_IN_ROW_FIRST ? InfoPanel.points.IN_A_ROW_1 : InfoPanel.points.IN_A_ROW_2;
		InfoPanel.updatePoints(level, points);
		var text = getText();
		self.message.html(text);
		self.message.addClass('charlesMessage-isSaying');
		self.message.on('animationend webkitAnimationEnd', function(e){
			$(this).removeClass('charlesMessage-isSaying');
		});		
		var currentHairHeight = growHair();
		if (currentHairHeight >= self.TURN_BLACK_HAIR_HEIGHT) {
			turnBlack();
		}
	}

	function turnBlack() {
		self.toy.addClass('charles-michael');
	}

	function growHair() {
		var charlesHair = self.toy.find('.charlesHead-hair');
		var currentHairHeight = parseInt(charlesHair.css('height').replace('px', ''));
		charlesHair.css('height', (currentHairHeight + self.HAIR_HEIGHT_ADJUSTMENT) + 'px');
		return currentHairHeight + self.HAIR_HEIGHT_ADJUSTMENT;
	}

	function getText() {
		return self.MESSAGE_ARRAY[Math.floor(Math.random() * self.MESSAGE_ARRAY.length)];
	}
};

Charles.prototype.removeShirt = function() {
	self.shirt.addClass('charlesBody-withoutShirt');
};

module.exports = new Charles();
},{"./app.js":1,"./info-panel":6}],5:[function(require,module,exports){
module.exports=require(1)
},{"./audio.js":2,"./char-engine.js":3,"./charles.js":4,"./info-panel.js":6,"./level-controller.js":7}],6:[function(require,module,exports){
var CharEngine = require('./char-engine.js');

var self;

function InfoPanel() {
	
	self = this;

	this.NUMBER_OF_LIFES = 4;
	
	this.infoPanel = $('.infoPanel');
	this.lifeBar = $('.infoPanel-life');
	this.score = $('.infoPanel-score');
	this.scorePoints = 0;
	this.level = $('.infoPanelLevel-text');
	this.pointsEarned = $('.points');
	
	this.POINTS_TOP_INITAL_POSITION = 20;
	this.POINTS_LEFT_INITAL_POSITION = 60;
	this.POINTS_TOP_ADJUSTMENT = 5;
	this.POINTS_LEFT_ADJUSTMENT = 20;

	this.points = { 
		CHAR: 18, 
		LEVEL: 664, 
		IN_A_ROW_1: 164,
		IN_A_ROW_2: 477
	};
}

InfoPanel.prototype.init = function() {

	initLife();
	self.level.html('L1');
	self.infoPanel.show(); 

	function initLife() {
		for (var i = 0; i < self.NUMBER_OF_LIFES; i++) {
			var div = document.createElement('div');
			div.className = 'infoPanel-lifeItem';
			self.lifeBar.append(div);		
		}
	}
};

InfoPanel.prototype.updateLife = function() {
	self.lifeBar.find('.infoPanel-lifeItem:first').remove();
};

InfoPanel.prototype.updateLevel = function(level) {
	self.level.html('L'+level);
};

InfoPanel.prototype.isAlive = function() {
	return self.lifeBar.find('.infoPanel-lifeItem:first').length > 0;
};


InfoPanel.prototype.getLife = function() {
	return self.lifeBar.find('.infoPanel-lifeItem:first').length;
};

InfoPanel.prototype.updatePoints = function(level, points) {

	var pointsToAdd = points ? 
		points * level : 
		self.points.CHAR * level;

	var currentChar = CharEngine.getCurrentChar();
	var charPoints = currentChar.charCodeAt(0);
	pointsToAdd += charPoints;
	console.log('currentChar', currentChar, 'charPoints', charPoints);

	self.scorePoints += pointsToAdd;
	self.score.html(self.scorePoints);

	showPoints(pointsToAdd);

	function showPoints(earnedPoints) {
		self.pointsEarned.html('+'+earnedPoints);
		var coordinates = getPointsCoordinates();
		self.pointsEarned.css({top: coordinates.top, left: coordinates.left});
		self.pointsEarned.addClass('points-isEarned');
		self.pointsEarned.on('animationend webkitAnimationEnd', function(e){
			$(this).removeClass('points-isEarned');
		});

		function getPointsCoordinates() {
			var topAdjustment = Math.floor(Math.random() * self.POINTS_TOP_ADJUSTMENT);
			var pointsTop = (self.POINTS_TOP_INITAL_POSITION - topAdjustment) + '%';
			var leftAdjustment = Math.floor(Math.random() * self.POINTS_LEFT_ADJUSTMENT);
			var pointsLeft = (self.POINTS_LEFT_INITAL_POSITION - leftAdjustment) + '%';
			return {top: pointsTop, left: pointsLeft};
		}
	}
};

module.exports = new InfoPanel();
},{"./char-engine.js":3}],7:[function(require,module,exports){
var self;

function LevelController() {

	self = this;
	this.level = 1;

	this.levelUp = $('.messagePanel-levelUpMessage');
}

LevelController.prototype.showLevelUp = function() {
	self.levelUp.html('LEVEL '+self.level+'!');
	self.levelUp.addClass('messagePanel-levelUpMessage-isLevelUp');
	self.levelUp.on('animationend webkitAnimationEnd', function(e){
		$(this).removeClass('messagePanel-levelUpMessage-isLevelUp');
	});
};

module.exports = new LevelController();
},{}]},{},[5])