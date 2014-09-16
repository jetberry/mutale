function GameView(InputManager, Actuator, StorageManager) {

	this.inputManager = new InputManager;
	this.storageManager = new StorageManager;
	this.actuator = new Actuator;

	this.isAnimation = false;

	this.heros = [];

	this.inputManager.on("move", this.move.bind(this));

	var p_url=location.search.substring(1);
	initLocal();

	var state = 0;//this.storageManager.getGameState();
	
	if(state){
		this.level = state ? state : 0;
		this.setup(this.level);
	}else{
		this.startTutorial();
	}
}


GameView.prototype.showFinishLevel = function() {
	var self = this;
	this.isAnimation = true;
	window.setTimeout(function() {
		self.actuator.finishLevel()
	}, 200);
	window.setTimeout(function() {
		self.actuator.showCheckmark()
	}, 1000);
	window.setTimeout(function() {
		self.nextLevel()
	}, 2000);
}


GameView.prototype.nextLevel = function() {
	this.level++;
	
	this.storageManager.setGameState(this.level);

	this.isAnimation = false;
	this.actuator.clearMessage();

	this.heros = [];
	this.actuator.clearContainer(this.actuator.endContainer); 

	gridContainer = document.getElementsByClassName("grid-container")[0];
	while (gridContainer.firstChild) {
		gridContainer.removeChild(gridContainer.firstChild);
	}
	

	this.setup(this.level);
	
}

GameView.prototype.startTutorial = function(level) {
	this.isTutorial = true;
	this.moveCount = 0;
	this.setup(-16);
}


GameView.prototype.setup = function(levelId) {
	if(levelId >= 32){
			this.showFinishScreen();
			return;
	}

    var season = this.getSeasonId(levelId);
    var jsonData = this.getSeasonData(season)

	var color = rgb(jsonData.r, jsonData.g, jsonData.b);

	var self = this;

	var previousState = this.storageManager.getGameState();

	var gameContainer = document.getElementsByClassName("game-container")[0];
	
	var levelTitle = document.getElementsByClassName("level-title")[0];
	if(levelId < 0){
		levelTitle.innerHTML = getLocalString("TUTORIAL");
	}else{
		levelTitle.innerHTML = getLocalString("LEVEL") + (levelId + 1);
	}

	var body = document.body;
	body.style.color = color;
	body.style.background = color;

	var level = jsonData.levels[levelId - season * 16];
	var matrix = this.flipHorizontally(level.matrix);

	var cellWidth = Math.floor(500 / matrix[0].length);

	this.actuator.setColor(color);
	this.actuator.setCellSize(cellWidth);
	this.actuator.setGridSize(Size(matrix[0].length - 1, matrix.length - 1));
	
	gameContainer.style.height = ( (matrix.length ) *  cellWidth) + "px";

	this.levelCore = new LevelCore(matrix);
	this.originLevelCore = new LevelCore(this.flipHorizontally(level.matrix));

	for (var y = matrix.length - 1; y >= 0; y--) {
		var row = document.createElement('div');
		row.className = "grid-row";
		document.getElementsByClassName("grid-container")[0].appendChild(row);
		for (var x = 0; x < matrix[y].length; x++) {
			var cell = document.createElement('div');
			
			cell.style.width = cellWidth + "px";
			cell.style.height = cellWidth + "px";
			row.appendChild(cell);
			if (matrix[y][x] != kColorWall) {
				var classes = ["color-none"];
				cell.style.background = color;
				self.actuator.applyClasses(cell, classes);
			}
			if (matrix[y][x] == kColorWall) {
				var classes = ["color-wall"];
				cell.style.background = color;
				self.actuator.applyClasses(cell, classes);
			}
			if (matrix[y][x] == kColorEnd) {
				self.actuator.addEndPosition(x,y);
			} 

			if (matrix[y][x] == kColorActive) {
				var hero = new Hero(x, y);
				this.heros.push(hero);
			}
		}
	}
	
	var getItOn = document.getElementsByClassName("store-label-header")[0];
	getItOn.innerHTML = getLocalString("GET_IT_ON");
	
	if(levelId < 0){
		var tutorialLabel = document.getElementsByClassName("tutorial-label")[0];
		tutorialLabel.innerHTML = getLocalString("TUTORIAL_1");
	}else if(levelId == 0){
		var tutorialLabel = document.getElementsByClassName("tutorial-label")[0];
		tutorialLabel.innerHTML = getLocalString("TUTORIAL_2");
	}else{
		var tutorialLabel = document.getElementsByClassName("tutorial-label")[0];
		tutorialLabel.innerHTML = "";
	}
	var tutorialLabel = document.getElementsByClassName("store-label");
	for(var i = 0; i < tutorialLabel.length; i++){
		tutorialLabel[i].style.color = color;
		if(levelId < 0 || levelId == 0){
		//	tutorialLabel[i].style.opacity = 0; 
		}else{
			tutorialLabel[i].style.opacity = 255;
		}
	}

	// Update the actuator
	this.actuate();

	this.actuator.startLelel();
};

GameView.prototype.flipHorizontally = function(matrix) {
	var newMatrix = [];

	for (var y = matrix.length - 1; y >= 0; y--) {
		var row = [];
		for (var x = 0; x < matrix[y].length; x++) {
			row.push(matrix[y][x]);
		}
		newMatrix.push(row);
	}
	return newMatrix;
};

// Sends the updated LevelCore to the actuator
GameView.prototype.actuate = function() {
	this.actuator.actuate(this.heros);
};

GameView.prototype.move = function(direction) {
	if(this.isTutorial){
		this.moveCount++;
		if(this.moveCount == 7){
			this.level = -1;
			this.storageManager.setGameState(0);
			this.showFinishLevel();
		}
	}
	
	if (this.isAnimation) {
		return;
	}


	var clear_positions = [];
	var clear_sizes = [];

	for (var i = 0; i < this.heros.length; i++) {
		var hero = this.heros[i];
		// 0: up, 1: right, 2: down, 3: left


		/* движемся направо, важна только высота */
		var field_size = hero.getSize();
		var delta_position;
		var endsize;
		switch (direction) {
			case kMoveRight:
				{
					endsize = this.levelCore.moveRightFrom(hero.getPosition(), field_size);
					if (endsize.width == 0.0) { /* значит, что вправо ходов нет => прижаться к стенке */
						endsize.width = 1;
						endsize.height = field_size.height;
						delta_position = Vec2(field_size.width - 1, 0);
					} else {
						delta_position = Vec2(field_size.width, 0);
					}
					break;
				}
			case kMoveLeft:
				{
					endsize = this.levelCore.moveLeftFrom(hero.getPosition(), field_size);
					if (endsize.width == 0.0) { /* значит, что вправо ходов нет => прижаться к стенке */
						endsize.width = 1;
						endsize.height = field_size.height;
						delta_position = Vec2(0, 0);
					} else {
						delta_position = Vec2(-endsize.width, 0);
					}
					break;
				}
			case kMoveTop:
				{
					endsize = this.levelCore.moveTopFrom(hero.getPosition(), field_size);
					if (endsize.height == 0.0) { /* значит, что вправо ходов нет => прижаться к стенке */
						endsize.height = 1;
						endsize.width = field_size.width;
						delta_position = Vec2(0, field_size.height - 1);
					} else {
						delta_position = Vec2(0, field_size.height);
					}
					break;
				}
			case kMoveBot:
				{
					endsize = this.levelCore.moveBotFrom(hero.getPosition(), field_size);
					if (endsize.height == 0.0) { /* значит, что вправо ходов нет => прижаться к стенке */
						endsize.height = 1;
						endsize.width = field_size.width;
						delta_position = Vec2(0, 0);
					} else {
						delta_position = Vec2(0, -endsize.height);
					}
					break;
				}

			default:
				break;
		}

		if (endsize.x == 0.0 && endsize.y == 0.0) {

		} else {
			is_move = true;

			clear_positions.push(hero.getPosition());
			clear_sizes.push(field_size);

			delta_position.x += hero.x;
			delta_position.y += hero.y;

			hero.updatePosition(delta_position);
			hero.setSize(endsize.width, endsize.height);
		}
	}

	for (var i = 0; i < clear_sizes.length; i++) {
		this.levelCore.clearArea(clear_positions[i], clear_sizes[i]);
	}

	for (var i = 0; i < this.heros.length; i++) {
		hero = this.heros[i];
		this.levelCore.setActiveArea(hero.getPosition(), hero.getSize());
	}

	this.actuate();

	var self = this;
	var is_complete = this.checkComplete();

	if (is_complete) {
		window.setTimeout(function() {
			self.showFinishLevel()
		}, 120);
	}

};

GameView.prototype.checkComplete = function(direction) {
	var is_complete = true;
	for (var y = 0; y < this.levelCore.matrix.length; y++) {
		for (var x = 0; x < this.levelCore.matrix[y].length; x++) {
			if (this.levelCore.matrix[y][x] == kColorActive) {
				if (this.originLevelCore.matrix[y][x] == kColorEnd) { /* правильная клекта */

				} else { /* неправильная клетка, можно закончить обход */
					is_complete = false;
				}
			}

			if (this.originLevelCore.matrix[y][x] == kColorEnd) {
				if (this.levelCore.matrix[y][x] == kColorActive) { /* правильная клекта */

				} else { /* неправильная клетка, можно закончить обход */
					is_complete = false;
				}
			}

			if (!is_complete) break;
		}
	}

	return is_complete;
}

GameView.prototype.getSeasonId = function(level) {
	if(level == -16){
		return -1;
	}
	return Math.floor(level / 16);
}

GameView.prototype.getSeasonData = function(season) {
	var seasonData;
	
	if(season == 0){
		seasonData = season_1;
	}else if(season == 1){
		seasonData = season_2;
	}else if(season == -1){
		seasonData = season_t;
	}
	
	return seasonData;
}

GameView.prototype.showFinishScreen = function() {
	var tutorialLabel = document.getElementsByClassName("tutorial-label")[0];
	tutorialLabel.innerHTML = "";
	
	var gameContainer = document.getElementsByClassName("game-container")[0];
	
	var levelTitle = document.getElementsByClassName("level-title")[0];
	levelTitle.innerHTML = getLocalString("FINISH");;
	
	var container = document.getElementsByClassName("container")[0];
	container.style.height = 0 + "px";
	container.style.minHeight = 0 + "px";
	
	var storeContainer = document.getElementsByClassName("store-container")[0];
	storeContainer.style.marginTop = "700px";
	//container heigth = "0px";
	//store-container
	//margin-top: 600px;
	
	var color = rgb(0, 97, 0);
	var body = document.body;
	body.style.color = color;
	body.style.background = color;
	
	var tutorialLabel = document.getElementsByClassName("store-label");
	for(var i = 0; i < tutorialLabel.length; i++){
		tutorialLabel[i].style.color = color;
	}
	
	gameContainer.innerHTML = storeContainer.innerHTML;
	storeContainer.innerHTML = "";
	
	
	this.actuator.setColor(color);
	this.actuate();
	this.actuator.startLelel();
}
