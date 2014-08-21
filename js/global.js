function Vec2(x, y){
	return {x : x, y: y};
}

function Size(width, height){
	return {width : width, height: height};
}

function rgb(r,g,b) {
    return 'rgb(' + [(r||0),(g||0),(b||0)].join(',') + ')';
}

INT_MAX = 123312313;

kColorNone = 0;
kColorWall = 1;
kColorActive = 2;
kColorEnd = 3;
kColorUserWall = 4;


kMoveLeft = 3;
kMoveRight = 1;
kMoveTop = 0;
kMoveBot = 2;