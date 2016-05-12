var InfoPanel = require('./info-panel');

var self;

function Charles() {
	
	self = this;

	this.MESSAGE_ARRAY = ['Awesome!', 'Cooool', 'Very good :>', 'Let\'s dance!', 'Nice', 'Wow', ':)))', 'Follow me!', 'Like Jackson!'];
	this.NUMBER_OF_DANCES = 4;
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
		if (currentHairHeight == self.TURN_BLACK_HAIR_HEIGHT) {
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