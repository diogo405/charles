$(function(){

	var Audio = require('./audio.js');
	var InfoPanel = require('./info-panel.js');
	var CharEngine = require('./char-engine.js');
	var Charles = require('./charles.js');
	var LevelController = require('./level-controller.js');
	 
	var $body = $('body');
	var $startMessage = $('.start-message');
	var correct = 0;
	var correctInRow = 0;
	var started = false;
	var newChar;
	var keypressed;	

	var changeLevel = function() {
		if (correct === 0 || correct % 7 !== 0) return;

		// else
		Audio.levelUp.play();
		LevelController.level++;
		InfoPanel.updateLevel(LevelController.level);
		LevelController.showLevelUp();
		InfoPanel.updatePoints(LevelController.level, InfoPanel.points.LEVEL);
		CharEngine.updateSpeed();
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

	var gameOver = function() {
		started = false;
		$body.addClass('game-over');
		Audio.background.currentTime = 0;
		$body.off('keypress');

		$('.game-over .blur, .game-over .game-over-message').on('click', function(){		
			// TODO
		});
	}; 
 
	var start = function() {
		Audio.background.play();
		InfoPanel.init();
 
		setInterval(function(){ newChar = CharEngine.show(); }, 1000);
 
		$body.on('keypress', function(e){
			var charCode = e.which || e.keyCode;
			keypressed = String.fromCharCode(charCode);
			if (keypressed && newChar && keypressed.toUpperCase() == newChar.toUpperCase()) {
				Audio.success.play();
				correctInRow++;
				Charles.claim(correctInRow, LevelController.level);
				correct++;
				InfoPanel.updatePoints(LevelController.level);
				changeLevel();
				Charles.dance();
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