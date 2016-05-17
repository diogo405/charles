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