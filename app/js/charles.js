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

module.exports = new Charles();