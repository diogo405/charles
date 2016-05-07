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