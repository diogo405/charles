var self;

function LevelController() {

	self = this;
	this.level = 1;

	this.levelUp = $('.messagePanel-levelUpMessage');
}

LevelController.prototype.showLevelUp = function() {
	self.levelUp.html('LEVEL '+self.level+'!');
	self.levelUp.addClass('messagePanel-levelUpMessage-isLevelUp');
	self.levelUp.on('animationend webkitAnimationEnd', function(e){
		$(this).removeClass('messagePanel-levelUpMessage-isLevelUp');
	});
};

module.exports = new LevelController();