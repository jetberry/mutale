kLocalDic = {
	"ru" : {
		"TUTORIAL" : "Обучение",
		"LEVEL" : "Уровень ",
		"TUTORIAL_1" : "Изменяй размеры рамки по вертикали или горизонтали. Для управления используй стрелки",
		"TUTORIAL_2" : "Великолепно! Теперь перемети рамку на указанное место",
		"FINISH" : "Эта версия содержит 32 уровня. Полная версия содержит более 100 уровней",
		"GET_IT_ON" : "Так же в:"
	},
	"en" : {
		"TUTORIAL" : "Tutorial",
		"LEVEL" : "Level ",
		"TUTORIAL_1" : "You can stretch and squeeze the frame horizontally and vertically, try it! Use your arrow keys.",
		"TUTORIAL_2" : "Great! Now try to move the frame to the shown place",
		"FINISH" : "Browser version contains only 32 levels. The full version with more than 100 levels",
		"GET_IT_ON" : "Get it on:"
	}
}

kLocal = "";

function setLocal(local){
	if(local == "en" || local == "ru"){
		kLocal = local;
	}else{
		kLocal = "en"
	}
}

function getLocalString(key){
	return kLocalDic[kLocal][key];
}


