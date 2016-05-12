var self;

function InfoPanel() {
	
	self = this;

	this.NUMBER_OF_LIFES = 4;
	
	this.infoPanel = $('.infoPanel');
	this.lifeBar = $('.infoPanel-life');
	this.score = $('.infoPanel-score');
	this.scorePoints = 0;
	this.level = $('.infoPanelLevel-text');
	
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

	self.scorePoints = points ? 
		self.scorePoints + points * level : 
		self.scorePoints + self.points.CHAR * level;

	self.score.html(self.scorePoints);
};

module.exports = new InfoPanel();