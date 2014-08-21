function HTMLActuator() {
	this.heroContainer = document.querySelector(".tile-container");
	this.scoreContainer = document.querySelector(".score-container");
	this.bestContainer = document.querySelector(".best-container");
	this.checkmarkContainer = document.querySelector(".checkmark");
	
	this.endContainer = document.querySelector(".end-container");
}

HTMLActuator.prototype.setCellSize = function(size) {
	this.cellSize = size;
}

HTMLActuator.prototype.setGridSize = function(size) {
	this.gridSize = size;
}

HTMLActuator.prototype.setColor = function(color) {
	this.color = color;
}

HTMLActuator.prototype.actuate = function(heros) {
	var self = this;

	window.requestAnimationFrame(function() {
		self.clearContainer(self.heroContainer);
		heros.forEach(function(hero) {
			self.addHero(hero);
		});
	});
};

HTMLActuator.prototype.finishLevel = function() {
	var self = this;

	var container = document.getElementsByClassName("tile-container")[0];

	window.requestAnimationFrame(function() {
		var classes = ["tile-container", "tile-container-finish"];
		container.style.opacity = 0;
		self.applyClasses(container, classes);


		var cells = document.getElementsByClassName("color-wall");
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			var classes = ["grid-cell-finish", "color-wall"];
			cell.style.background = self.color;
			self.applyClasses(cell, classes);
			self.clearContainer(cell);
		}
		
		var endCells = document.getElementsByClassName("color-end");
		for (var i = 0; i < endCells.length; i++) {
			var cell = endCells[i];
			var classes = ["grid-cell-finish", "color-end"];
			cell.style.background = self.color;
			self.applyClasses(cell, classes);
			self.clearContainer(cell);
		}

		document.body.style.background = self.color;
		var classes = ["grid-cell-finish"];
		self.applyClasses(document.body, classes);

	});
};

HTMLActuator.prototype.startLelel = function() {
	var self = this;

	var gameContainer = document.getElementsByClassName("game-container")[0];
	var container = document.getElementsByClassName("tile-container")[0];

	//	gameContainer.style.opacity = 0;

	window.requestAnimationFrame(function() {

		document.body.style.background = "#fff4ed";
		var classes = ["grid-cell-finish"];
		self.applyClasses(document.body, classes);

		classes = ["tile-container"];
		self.applyClasses(container, classes);
		container.style.opacity = 1;

		var cells = document.getElementsByClassName("color-wall");
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			var classes = ["grid-cell-start ", "color-wall"];
			cell.style.background = "#fff4ed";
			self.applyClasses(cell, classes);
			self.clearContainer(cell);
		}
	});
};

HTMLActuator.prototype.clearContainer = function(container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

HTMLActuator.prototype.addHero = function(hero) {
	var self = this;

	var cellSize = self.cellSize;

	var wrapper = document.createElement("div");
	var inner = document.createElement("div");


	var position = this.flipHorizontally(hero.previousPosition, hero.previousSize.height);
	var dX = (hero.previousSize.width - 1) / 2;
	var x = position.x + dX;
	var dY = (hero.previousSize.height - 1) / 2;
	var y = position.y + dY;


	var classes = ["tile"];

	this.applyClasses(wrapper, classes);
	this.applyClasses(inner, classes);

	var transform = "translate(" + x * cellSize + "px, " + y * cellSize + "px)";
	transform += " scale(" + hero.previousSize.width + "," + hero.previousSize.height + ")";
	this.setTransform(wrapper, transform);

	wrapper.style.height = cellSize + "px";
	wrapper.style.width = cellSize + "px";

	transform = "translate(" + (x * cellSize) + "px, " + (y * cellSize) + "px)";
	var scale = {};
	scale.x = (hero.previousSize.width * cellSize - 12) / (hero.previousSize.width * cellSize);
	scale.y = (hero.previousSize.height * cellSize - 12) / (hero.previousSize.height * cellSize);

	scale.x *= hero.previousSize.width;
	scale.y *= hero.previousSize.height;

	transform += " scale(" + scale.x + "," + scale.y + ")";
	this.setTransform(inner, transform);
	inner.style.height = (cellSize) + "px";
	inner.style.width = (cellSize) + "px";

	inner.style.background = this.color;

	window.requestAnimationFrame(function() {
		var position = self.flipHorizontally(Vec2(hero.x, hero.y), hero.height);
		var dX = (hero.width - 1) / 2;
		var x = position.x + dX;
		var dY = (hero.height - 1) / 2;
		var y = position.y + dY;

		var transform = "translate(" + x * cellSize + "px, " + y * cellSize + "px)";
		transform += " scale(" + hero.width + "," + hero.height + ")";
		self.setTransform(wrapper, transform);

		transform = "translate(" + (x * cellSize) + "px, " + (y * cellSize) + "px)";
		var scale = {};
		scale.x = (hero.width * cellSize - 12) / (hero.width * cellSize);
		scale.y = (hero.height * cellSize - 12) / (hero.height * cellSize);

		scale.x *= hero.width;
		scale.y *= hero.height;

		transform += " scale(" + scale.x + "," + scale.y + ")";
		self.setTransform(inner, transform);
	});

	this.heroContainer.appendChild(wrapper);
	this.heroContainer.appendChild(inner);

	hero.elemet = wrapper;
	hero.isAdded = true;
}

HTMLActuator.prototype.flipHorizontally = function(position, height) {
	height--;
	var newPosition = Vec2(position.x, this.gridSize.height - position.y - height);
	return newPosition;
}

HTMLActuator.prototype.applyClasses = function(element, classes) {
	element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.showCheckmark = function() {
	this.checkmarkContainer.classList.add("checkmark-completed");

	var imgContainer = document.querySelector(".game-img-container");
	var img = document.getElementById("message-img");
	var height = window.screen.height;
};


HTMLActuator.prototype.addEndPosition = function(x, y) {
	var endCell = document.createElement('div');
	endCell.style.background = "#c8c8c8";
	endCell.style.opacity = 0.6;
	endCell.style.width = this.cellSize + "px";
	endCell.style.height = this.cellSize + "px";
	
	var cellSize = this.cellSize;
	var position = this.flipHorizontally(Vec2(x,y), 1);
	var x = position.x;
	var y = position.y;

	var classes = ["color-end"];

	this.applyClasses(endCell, classes);

	var transform = "translate(" + x * cellSize + "px, " + y * cellSize + "px)";
	this.setTransform(endCell, transform);

	endCell.style.height = this.cellSize + "px";
	endCell.style.width = this.cellSize + "px";
	
	
	this.endContainer.appendChild(endCell);
}

HTMLActuator.prototype.setTransform = function(element, transform) {
		element.style.webkitTransform = transform;
		element.style.MozTransform = transform;
		element.style.msTransform = transform;
		element.style.OTransform = transform;
		element.style.transform = transform;
};

HTMLActuator.prototype.clearMessage = function() {
	this.checkmarkContainer.classList.remove("checkmark-completed");
};
