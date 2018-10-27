//
// Alex Viznytsya
// NetID: avizny2
//
// IT 202 - Web and Multimedia Technology
// Fall 2018, UIC
//
// Project# 2 - Simple Scrolling Game
// 10.16.2018
//
function GameCharacter(n, i, x, y, w, h, r, d) {
	this.charName = n;
	this.width = w;
	this.height = h;
	this.radius = r;
	if (this.charName == "player") {
		this.posX = x; // 360
		this.posY = y; // 710
	} else {
		this.posX = Math.floor(Math.random() * (gameSettings.width - this.width));
		this.posY = 0 - (Math.floor(Math.random() * 200) + this.height);
	}
	this.image = new Image();
	this.image.src = i;
	this.damage = d
}

var gameSettings = { 
	canvas: "",
	width: 800,
	height: 800,
	playerImg: "images/player.png",
	asteroidImg: "images/asteroid.png",
	pizzaImg: "images/pizza.png"
};

var gamePlay = {
	player: "",
	gameObjects: new Array(),
	health: 100,
	score: 0,
	speed: 2,
	level :1,
	gameOver: false
}



var moveLeft = function() {
	if (gamePlay.player.posX >= 5) {
		gamePlay.player.posX -= 30;
	}
}

var moveRight = function() {
	if (gamePlay.player.posX <= (gameSettings.width - gamePlay.player.width - 5)) {
		gamePlay.player.posX += 30;
	}
}

var init = function() {
	gameSettings.canvas = document.getElementById('gameCanvas').getContext('2d');
	
	$(document).keydown(function(e) {
	    if (e.which == 37) {
	      moveLeft();
	    } else if (e.which == 39) {
	      moveRight();
	    }
	  });
	
};

var drawRoundedRect = function(width, height, radius, color) {
	var recX = (gameSettings.width - width) / 2
	var recY = (gameSettings.height - height) / 2
	var radius = {tl: radius, tr: radius, br: radius, bl: radius};
	gameSettings.canvas.beginPath();
	gameSettings.canvas.fillStyle = color;
  	gameSettings.canvas.moveTo(recX + radius.tl, recY);
  	gameSettings.canvas.lineTo(recX + width - radius.tr, recY);
  	gameSettings.canvas.quadraticCurveTo(recX + width, recY, recX + width, recY + radius.tr);
  	gameSettings.canvas.lineTo(recX + width, recY + height - radius.br);
  	gameSettings.canvas.quadraticCurveTo(recX + width, recY + height, recX + width - radius.br, recY + height);
  	gameSettings.canvas.lineTo(recX + radius.bl, recY + height);
  	gameSettings.canvas.quadraticCurveTo(recX, recY + height, recX, recY + height - radius.bl);
  	gameSettings.canvas.lineTo(recX, recY + radius.tl);
  	gameSettings.canvas.quadraticCurveTo(recX, recY, recX + radius.tl, recY);
  	gameSettings.canvas.fill();
}

var startGameBanner = function() {

	drawRoundedRect(400, 100, 10, "#8bc452");

    // Add text:
    gameSettings.canvas.beginPath();
    gameSettings.canvas.fillStyle = "black";
    gameSettings.canvas.font = "30px Arial";
    gameSettings.canvas.textAlign = "center";
	gameSettings.canvas.fillText("Click to START GAME", gameSettings.width / 2, gameSettings.height / 2 + 10);

	// Add one click event listener:
	$("#gameCanvas").one("click" ,function() { 
  		startGame();
  	});
};

var gameOverBanner = function() {
	// Draw start button:
	drawRoundedRect(400, 280, 10, "#8bc452");
 
    // Add text:
    gameSettings.canvas.fillStyle = "black";
    gameSettings.canvas.font = "30px Arial";
    gameSettings.canvas.textAlign = "center";
	gameSettings.canvas.fillText("GAME OVER",gameSettings.width / 2, (gameSettings.width - 200) / 2 + 20);
	gameSettings.canvas.fillText("Your score: " + gamePlay.score ,gameSettings.width / 2, (gameSettings.width - 200) / 2 + 80);
	gameSettings.canvas.fillText("Max speed: " + gamePlay.speed ,gameSettings.width / 2, (gameSettings.width - 200) / 2 + 120);
	gameSettings.canvas.fillText("Level: " + gamePlay.level ,gameSettings.width / 2, (gameSettings.width - 200) / 2 + 160);
	gameSettings.canvas.fillText("Click to start NEW GAME",gameSettings.width / 2, (gameSettings.width - 200) / 2 + 220);

	$("#gameCanvas").one("click" ,function() { 
  		startGame();
  	});

};

var detectCollision = function(obj) {
	var centerPX = gamePlay.player.posX + (gamePlay.player.width / 2);
	var centerPY = gamePlay.player.posY + (gamePlay.player.height / 2);

	var centerOX = obj.posX + (obj.width / 2);
	var centerOY = obj.posY + (obj.height / 2);

	var dx = centerPX - centerOX;
	var dy = centerPY - centerOY;
	var distance = Math.sqrt(dx * dx + dy * dy);

	if (distance > (obj.radius * 2) ) {
		return false;
	} else {
		return true;
	}
};

var draw = function() {
	// Clear canvas:
	gameSettings.canvas.clearRect(0, 0, gameSettings.width, gameSettings.height);

	// Draw player:
    gameSettings.canvas.drawImage(gamePlay.player.image, gamePlay.player.posX, gamePlay.player.posY, gamePlay.player.width, gamePlay.player.height);

    // Draw game objects:
    for (i = 0; i < gamePlay.gameObjects.length; i++) {
    	var obj = gamePlay.gameObjects[i];
    	if (obj.posY >= gameSettings.height) {
    		obj.posY = 0 - (Math.floor(Math.random() * 200) + obj.height * 2 );
    		obj.posX = Math.floor(Math.random() * (gameSettings.width - obj.width));
    	}

    	// Check collisions:
    	if (detectCollision(obj) == true) {
    		if (obj.charName == 'harm') {
    			gamePlay.health += obj.damage;
    		} else if (obj.charName == "benefit") {
    			gamePlay.score += obj.damage;
    		}

    		obj.posY = 0 - (Math.floor(Math.random() * 200) + obj.height * 2);
    		obj.posX = Math.floor(Math.random() * (gameSettings.width - obj.width));

    		if (gamePlay.score > 0 && (gamePlay.score % 30) == 0) {
    			gamePlay.level += 1;
    			gamePlay.speed += 1;
	    		if ((gamePlay.score % 60) == 0) {
	    			gamePlay.gameObjects.push(new GameCharacter("harm", gameSettings.asteroidImg, 0, 0, 80, 80, 40, -20));
					gamePlay.gameObjects.push(new GameCharacter("benefit", gameSettings.pizzaImg, 0, 0, 80, 80, 40, 10));
	    		}
    		}
    	}

    	// Check if player still has health:
    	if (gamePlay.health <= 0) {
    		gamePlay.gameOver = true;
    	}

    	obj.posY += gamePlay.speed;
    	gameSettings.canvas.drawImage(obj.image, obj.posX, obj.posY, obj.width, obj.height);
    }

	// Draw score:
	gameSettings.canvas.beginPath();
    gameSettings.canvas.font = "25px Arial";
    gameSettings.canvas.fillStyle = "#8bc452";
    gameSettings.canvas.textAlign = "left";
    gameSettings.canvas.fillText("SCORE: " + gamePlay.score, 10, 35);

    // Draw level:
	gameSettings.canvas.beginPath();
    gameSettings.canvas.fillText("LEVEL: " + gamePlay.level, 10, 65);

	// Draw health:
	gameSettings.canvas.beginPath();
    gameSettings.canvas.textAlign = "right";
    gameSettings.canvas.fillText("HEALTH ", gameSettings.width - 200, 35);
    
    gameSettings.canvas.beginPath();
    gameSettings.canvas.strokeStyle = "#8bc452";
    gameSettings.canvas.rect(gameSettings.width - 190, 10, 180, 30);
    gameSettings.canvas.stroke();

    gameSettings.canvas.beginPath();
    gameSettings.canvas.fillStyle = "#8bc452";
    gameSettings.canvas.fillRect(gameSettings.width - 190, 10, (gamePlay.health / 100) * 180, 30);
    gameSettings.canvas.fill();

	// Check game state:
	if (gamePlay.gameOver == false) {
		window.requestAnimationFrame(draw)
	} else {
		gameOverBanner();
	}
};

var startGame = function() {
	gamePlay.player = new GameCharacter("player", gameSettings.playerImg, 360, 710, 80, 80, 40, 0);

	if (gamePlay.gameObjects.length > 0) {
		gamePlay.gameObjects = new Array();
		gamePlay.health = 100;
		gamePlay.level =1;
		gamePlay.speed = 2;
		gamePlay.score = 0;
		gamePlay.gameOver = false;
	}

	gamePlay.gameObjects.push(new GameCharacter("harm", gameSettings.asteroidImg, 0, 0, 80, 80, 40, -20));
	gamePlay.gameObjects.push(new GameCharacter("benefit", gameSettings.pizzaImg, 0, 0, 80, 80, 40, 10));

	window.requestAnimationFrame(draw)
}

$(document).ready(function() {
	// Initialize game:
	init();

	// Setup and start gameplay:
	startGameBanner();
});