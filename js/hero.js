function Hero(x,y) {
  this.x = x;
  this.y = y;
  this.isAdded = false;
  this.previousPosition = { x: this.x, y: this.y };
  this.previousSize = { height: 1, width: 1 };
  this.height = 1;
  this.width = 1;
}

Hero.prototype.setSize = function (width, height) {
	this.saveSize();
    this.height = height;
    this.width = width;
}

Hero.prototype.getSize = function () {
	var size = { height: this.height, width: this.width }
    return size;
}

Hero.prototype.getPosition = function (height, width) {
	var position = { x: this.x, y: this.y }
    return position;
}

Hero.prototype.saveSize = function () {
  this.previousSize = { height: this.height, width: this.width };
};

Hero.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Hero.prototype.updatePosition = function (position) {
  this.savePosition();
  this.x = position.x;
  this.y = position.y;
};

Hero.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value
  };
};
