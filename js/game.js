 window.onload = function() {
    //start crafty
    Crafty.init(800,600);
	Crafty.canvas();
    Crafty.sprite(40, "img/sprite40.png", {
        grass1: [0,0],
        grass2: [1,0],
        grass3: [2,0],
        grass4: [3,0],
        flower: [0,1],
        bush1: [0,2],
        bush2: [1,2],
        player: [0,4]
        //note for graphics, the images of the alien head need to be moved down by one pixle in the sprite40.png file, a black pixle apears beneath each bush and the black outline of the alien head is cut off when it is facing up
    });

    Crafty.c  ("Unit", {
        _xPos : 0,
        _yPos : 0,
        deductHealth: function(){},
        addMoney: function(){} ,
        destroy: function(){},
        canMoveTo: function(){}
    }); 
    Crafty.c  ("HumanInfantry", {
        _health: 90,
        _speed: 7 ,
        _damage: 30});
    Crafty.c ("AlienInfantry", {
        _health: 80,
        _speed: 7,
        _damage: 45});
    Crafty.c ("RobotInfantry", {
        _health: 100,
        _speed: 7,
        _damage: 25});
    Crafty.c ("VoidInfantry", {
        _health: 95,
        _speed: 7,
        _damage: 35});
    Crafty.c ("HumanTank", {
        _health: 250, 
        _speed: 5,
        _damage: 120});
    Crafty.c ("AlienTank", {
        _health: 225,
        _speed: 5,
        _damage: 145});
    Crafty.c ("RobotTank", {
        _health: 280,
        _speed: 5,
        _damage: 110});
    Crafty.c ("VoidTank", {
        _health: 265,
        _speed: 5,
        _damage: 130});
    Crafty.c ("HumanJet", {
        _health: 155,
        _speed: 10,
        _damage: 230});
    Crafty.c ("AlienJet", {
        _health: 130,
        _speed: 10,
        _damage: 255});
    Crafty.c ("RobotJet", {
        _health: 190,
        _speed: 10,
        _damage: 210});
    Crafty.c ("VoidJet", {
        _health: 170,
        _speed: 40,
        _damage: 240,
        init: function() {
            var jet = this;
            jet.addComponent("2D, Canvas, player, Mouse, Controls, Animate, Collision")
    		.attr({x: 160, y: 144, z: 1})
			.bind("enterframe", function(e) {
				if (this.canMove){
                    if(this.isDown("LEFT_ARROW")) {
    				} else if(this.isDown("RIGHT_ARROW")) {
    				} else if(this.isDown("UP_ARROW")) {
    				} else if(this.isDown("DOWN_ARROW")) {
    				}
				}
			}).bind("keyup", function(e) {
				this.stop();
			})
			.collision()
			.onHit("wall_left", function() {
				this.x += jet._speed;
				this.stop();
			}).onHit("wall_right", function() {
				this.x -= jet._speed;
				this.stop();
			}).onHit("wall_bottom", function() {
				this.y -= jet._speed;
				this.stop();
			}).onHit("wall_top", function() {
				this.y += jet._speed;
				this.stop();
            }).bind("click",function(){jet.canMove = !jet.canMove});
    	},
        toggleMovement: function(){
                var jet = this;
                jet.canMove = !jet.canMove;
            },
        moveToTile: function(column, row){
            this.attr({x: column * 40, y: row *40, z: 1})
            }
    });
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
        Crafty.load(["img/sprite.png","img/grid/fullgrid.png","img/grid/sidebar.png"], function() {
            Crafty.scene("main"); //when everything is loaded, run the main scene
            Crafty.background("url('img/grid/fullgrid.png')");
        });
		
		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading")
			.css({"text-align": "center"});
	});
	
	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function() {
        var unitsOnBoard = [],
            gameState = {};


        
        function newUnit(row,column,race) {
            var location = blockToPixels(row, column);
            var unit = Crafty.e(race)
            .attr({x: location.x, y: location.y, z: 2});
            unitsOnBoard.push(unit);
        }
        
        function removeUnitByIndex(x){    
            unitsOnBoard[x].destroy();
            unitsOnBoard.splice(x,1);
        }
        
        function moveUnitByIndex(index,column,row){    
            var workingWith = unitsOnBoard[index];
            if(column <= 14 && row <= 14){
                workingWith.moveToTile(column,row);
            }
        
        }

        Crafty.e("2D, DOM, image").attr({w: 200, h: 600, x: 600, y: 0})
            .image("img/grid/sidebar.png");
        
        var x = 1;
        var y = 1;
        for(count = 0; count <= 5; count++){
            newUnit(x,y,"VoidJet");
            x += 1;
            y += 1;
        }

        moveUnitByIndex(3,9,10);
        var gameStateLabel = Crafty.e("2D, DOM, Text").attr({ x: 600, y: 10, w: 200}).css("text-align","center");
        
        function blockToPixels(row,column){
            var x = column * 40;
            var y = row * 40;
            return {x:x, y:y};
        };
        
        function pixelsToBlock(x,y){
            // Each block is 40x40 pixels
            var column = Math.floor(x / 40);
            var row = Math.floor(y / 40);
            return {column: column, row: row};
        };
        
        var addUnitbutton = Crafty.e("2D, DOM, image").attr({w: 190, h: 80, x: 605, y: 30})
            .image("img/grid/fullgrid.png"); 


        function changeLabel(x) {
            switch(x) {
                case "move" : 
                    return "MOVE UNIT.";
                break;
                case "attack" : 
                    return "ATTACK UNIT.";
                break;
                case "buy" : 
                    return "BUILT UNIT.";
                break;
                case "capture" : 
                    return "CAPTURED BASE.";
                break;
                default : 
                    return "READY.";
                break;
            }
        }
        
        function possibleBlocks(currentRow, currentColumn, maxBlocks){
            var valid_spots = [];
            for(currentMax =1; currentMax <= maxBlocks; currentMax++){
                for(i=1; i <= currentMax; i++){
                    var newColumn = currentColumn + i;
                    var newRow = currentRow + (currentMax - i);
                   if(!(newColumn <0) && !(newRow < 0)){
                    valid_spots.push({row:newRow,column:newColumn});
                    }
                   newColumn = currentColumn - i;
                   newRow = currentRow - (currentMax - i);
                   if(!(newColumn <0) && !(newRow < 0)){
                    valid_spots.push({row:newRow,column:newColumn});
                    }
                    newColumn = currentColumn + i;
                   newRow = currentRow - (currentMax - i);
                   if(!(newColumn <0) && !(newRow < 0)){
                    valid_spots.push({row:newRow,column:newColumn});
                    }
                    newColumn = currentColumn - i;
                   newRow = currentRow - (currentMax + i);
                   if(!(newColumn <0) && !(newRow < 0)){
                    valid_spots.push({row:newRow,column:newColumn});
                    }
                }
            }
            return valid_spots;
        }
        
        Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
            // Gets the block that the player clicked on
            var blockClickedOn = pixelsToBlock(e.realX, e.realY);
            
            if(gameState.action != "move"){
                for(currentIndex = 0; currentIndex < unitsOnBoard.length; currentIndex++){
                    var currentUnit = unitsOnBoard[currentIndex],
                        currentUnitBlock = pixelsToBlock(currentUnit._x, currentUnit._y);
                    if(currentUnitBlock.column == blockClickedOn.column && currentUnitBlock.row == blockClickedOn.row){
                        gameState.selectedUnit = currentIndex;
                        gameState.action = "move";
                        gameStateLabel.text(changeLabel(gameState.action));
                    }
                }
            } else if(gameState.action == "move"){
                moveUnitByIndex(gameState.selectedUnit, blockClickedOn.column, blockClickedOn.row);
                gameState.action = "";
                gameStateLabel.text(changeLabel(gameState.action));
            }
    	});
	});
};        
