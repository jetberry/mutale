function LevelCore(matrix) {
	this.matrix = matrix;
}

// Build a LevelCore of the specified size
LevelCore.prototype.empty = function() {
	var cells = [];

	for (var x = 0; x < this.size; x++) {
		var row = cells[x] = [];

		for (var y = 0; y < this.size; y++) {
			row.push(null);
		}
	}

	return cells;
};


LevelCore.prototype.moveRightFrom = function(position, size) {
	size.height = Math.abs(size.height);
	size.width = Math.abs(size.width);

	position.x = position.x + size.width - 1;
	/* пробежаться по матрице направо и найти столкновение со стеной */
	var min_width = INT_MAX;
	for (var y = position.y; y < position.y + size.height; y++) {
		var width = 0;
		for (var x = position.x + 1; x < this.matrix[y].length; x++) {
			if (!this.isBarrier(this.matrix[y][x])) {
				width++;
			} else {
				break;
			}
		}

		if (min_width > width) min_width = width;
	}

	if (min_width == 0) { /* ходов в эту сторону нет, вернуть нули */
		var ret = {
			width: 0,
			height: 0
		};
		return ret;
	}

	/* расставить единицы на ширину min_width вправо */
	for (var y = position.y; y < position.y + size.height; y++) {
		for (var x = position.x + 1; x <= position.x + min_width; x++) {
			this.matrix[y][x] = 1;
		}
	}
	var ret = {
		width: min_width,
		height: size.height
	};
	return ret;
}

LevelCore.prototype.moveLeftFrom = function(position, size) {
	size.height = Math.abs(size.height);
	size.width = Math.abs(size.width);

	/* пробежаться по матрице налево и найти столкновение со стеной */
	var min_width = INT_MAX;
	for (var y = position.y; y < position.y + size.height; y++) {
		var width = 0;
		for (var x = position.x - 1; x >= 0; x--) {
			if (!this.isBarrier(this.matrix[y][x])) {
				width++;
			} else {
				break;
			}
		}

		if (min_width > width) min_width = width;
	}

	if (min_width == 0) { /* ходов в эту сторону нет, вернуть нули */
		var ret = {
			width: 0,
			height: 0
		};
		return ret;
	}

	/* расставить единицы на ширину min_width вправо */
	for (var y = position.y; y < position.y + size.height; y++) {
		for (var x = position.x - 1; x >= position.x - min_width; x--) {
			this.matrix[y][x] = 1;
		}
	}
	var ret = Size(min_width, size.height);
	return ret;
}

LevelCore.prototype.moveTopFrom = function(position, size) {
	size.height = Math.abs(size.height);
	size.width = Math.abs(size.width);

	position.y = position.y + size.height - 1;
	/* пробежаться по матрице навернх и найти столкновение со стеной */
	var min_height = INT_MAX;
	for (var x = position.x; x < position.x + size.width; x++) {
		var height = 0;
		for (var y = position.y + 1; y < this.matrix.length; y++) {
			if (!this.isBarrier(this.matrix[y][x])) {
				height++;
			} else {
				break;
			}
		}

		if (min_height > height) min_height = height;
	}

	if (min_height == 0) { /* ходов в эту сторону нет, вернуть нули */
		var ret = Size(0,0);
		return ret;
	}

	/* расставить единицы на высоту min_height вверх */
	for (var x = position.x; x < position.x + size.width; x++) {
		for (var y = position.y + 1; y <= position.y + min_height; y++) {
			this.matrix[y][x] = 1;
		}
	}
	var ret = Size(size.width,min_height);
	
	return ret;
}

LevelCore.prototype.moveBotFrom = function(position, size) {
	size.height = Math.abs(size.height);
	size.width = Math.abs(size.width);

	/* пробежаться по матрице навернх и найти столкновение со стеной */
	var min_height = INT_MAX ;
	for (var x = position.x; x < position.x + size.width; x++) {
		var height = 0;
		for (var y = position.y - 1; y >= 0; y--) {
			if (!this.isBarrier(this.matrix[y][x])) {
				height++;
			} else {
				break;
			}
		}

		if (min_height > height) min_height = height;
	}

	if (min_height == 0) { /* ходов в эту сторону нет, вернуть нули */
		var ret = Size(0,0);
		return ret;
	}

	/* расставить единицы на высоту min_height вверх */
	for (var x = position.x; x < position.x + size.width; x++) {
		for (var y = position.y - 1; y >= position.y - min_height; y--) {
			this.matrix[y][x] = 1;
		}
	}
	var ret = Size(size.width,min_height);
	
	return ret;
}

LevelCore.prototype.isBarrier = function(type) {
	if (type != kColorWall &&
		type != kColorActive &&
		type != kColorUserWall) {
		return false;
	} else {
		return true;
	}
}

LevelCore.prototype.clearArea = function(position, size) {
    size.height = Math.abs(size.height);
    size.width = Math.abs(size.width);
    
    for (var x = position.x; x < position.x + size.width; x++) {
        for (var y = position.y; y < position.y + size.height; y++) {
            this.matrix[y][x] = kColorNone;
        }
    }
}

LevelCore.prototype.setActiveArea = function(position, size) {
    size.height = Math.abs(size.height);
    size.width = Math.abs(size.width);
    
    for (var x = position.x; x < position.x + size.width; x++) {
        for (var y = position.y; y < position.y + size.height; y++) {
            this.matrix[y][x] = kColorActive;
        }
    }
}
