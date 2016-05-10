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
