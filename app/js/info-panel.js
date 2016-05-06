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

InfoPanel.prototype.updatePoints = function(level, points) {

	self.scorePoints = points ? 
		self.scorePoints + points * level : 
		self.scorePoints + self.points.CHAR * level;

	self.score.html(self.scorePoints);
};

module.exports = new InfoPanel();