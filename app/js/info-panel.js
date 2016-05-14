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