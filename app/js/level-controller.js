var self;

function LevelController() {

	self = this;
	this.level = 1;

	this.levelUp = $('.level-up');
}

LevelController.prototype.showLevelUp = function() {
	self.levelUp.html('LEVEL '+self.level+'!');
	self.levelUp.addClass('level');
	self.levelUp.on('animationend webkitAnimationEnd', function(e){
		$(this).removeClass('level');
	});
};

module.exports = new LevelController();