$(function(){

	var Audio = require('./audio.js');
	var InfoPanel = require('./info-panel.js');
	var Char = require('./char.js');
	var Charles = require('./charles.js');
	 
	var ANIMATION_DURATION_ADJUST = 0.025;
	var $body = $('body');
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
		InfoPanel.updateLevel(level);
		$levelUp.html('LEVEL '+level+'!');
		$levelUp.addClass('level');
		$levelUp.on('animationend webkitAnimationEnd', function(e){
			$(this).removeClass('level');
		});
		InfoPanel.updatePoints(level, InfoPanel.points.LEVEL);
		var $charsMove = $('.chars.move');
		var animationDuration = parseFloat($charsMove.css('animation-duration'));
		animationDuration -= ANIMATION_DURATION_ADJUST;
		animationDuration = animationDuration < 0.3 ? 0.3 : animationDuration; 
		if (animationDuration == 0.3) {
			CHAR_ARRAY.concat(CHAR_ARRAY_COMPLEMENT);
		}
		$charsMove.css({'animation-duration': animationDuration + 's'});
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
 
		setInterval(function(){ newChar = Char.show(); }, 1000);
 
		$body.on('keypress', function(e){
			var charCode = e.which || e.keyCode;
			keypressed = String.fromCharCode(charCode);
			if (keypressed && newChar && keypressed.toUpperCase() == newChar.toUpperCase()) {
				Audio.success.play();
				correctInRow++;
				Charles.claim(correctInRow, level);
				correct++;
				InfoPanel.updatePoints(level);
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