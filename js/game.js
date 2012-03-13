window.onload = function() {
    //start crafty
    Crafty.init(600,600);
	Crafty.canvas();
	
	//turn the sprite map into usable components
	Crafty.sprite(16, "../img/sprite.png", {
        
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1: [0,2],
		bush2: [1,2],
		player: [0,3]
	});
    Crafty.c  ("Unit", {
        _xPos : 0,
        _yPos : 0,
        deductHealth: function(){},
        addMoney: function(){} ,
        destroy: function(){},
        canMoveTo: function(){}
    }); 
/*
            for (i = 0; i <= speed; i++){
             for (i = 0; i <= speed; i++){
              var x = xPos + i;
              var y = yPos + (speed - i);
              if (!(x <0) && !(y < 0)){
                valid_spots.push({x:x,y:y})}
              var x2 = xPos - i;
              var y2 = yPos - (speed - i);
              if(!(x2 <0) && !(y2 < 0)){
                valid_spots.push({x:x2,y:y2})}
             }   
            }
        }
            });
- hover over unit and click to make movable
- click on a square within range, if enemy withing range, add attack option
- confirm move prompt
 Pseudo-code to find possible boxes to move to           
valid_spots = []

for(i =1; i <= MAXBLOCKS; i++) // Current Max

for(i =1; i <= CURRENT_MAX; i++){ //Calculates Edge
   x = x + i;
   y = y + (speed - i);
   if(!(x <0) && !(y < 0)){
    valid_spots.push({x:x,y:y})}
   x2 = x - i;
   y2 = y - (speed - i);
   
   if(!(x2 <0) && !(y2 < 0)){
	valid_spots.push({x:x2,y:y2})}
}
            */
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
            jet.addComponent("2D, Canvas, player, Mouse, Controls, CustomControls, Animate, Collision")
    		.attr({x: 160, y: 144, z: 1})
			.CustomControls(1)
			.animate("walk_left", 6, 3, 8)
			.animate("walk_right", 9, 3, 11)
			.animate("walk_up", 3, 3, 5)
			.animate("walk_down", 0, 3, 2)
			.bind("enterframe", function(e) {
				if (this.canMove){
                    if(this.isDown("LEFT_ARROW")) {
    					if(!this.isPlaying("walk_left"))
    						this.stop().animate("walk_left", 10);
    				} else if(this.isDown("RIGHT_ARROW")) {
    					if(!this.isPlaying("walk_right"))
    						this.stop().animate("walk_right", 10);
    				} else if(this.isDown("UP_ARROW")) {
    					if(!this.isPlaying("walk_up"))
    						this.stop().animate("walk_up", 10);
    				} else if(this.isDown("DOWN_ARROW")) {
    					if(!this.isPlaying("walk_down"))
    						this.stop().animate("walk_down", 10);
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

	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < 37; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < 37; j++) {
				grassType = Crafty.randRange(1, 4);
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * 16, y: j * 16});
			}
		}
		
		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < 37; i++) {
			Crafty.e("2D, Canvas, wall_top, bush"+Crafty.randRange(1,2))
				.attr({x: i * 16, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, bush"+Crafty.randRange(1,2))
				.attr({x: i * 16, y: 577, z: 2});
		}
		
		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < 37; i++) {
			Crafty.e("2D, DOM, wall_left, bush"+Crafty.randRange(1,2))
				.attr({x: 0, y: i * 16, z: 2});
			Crafty.e("2D, Canvas, wall_right, bush"+Crafty.randRange(1,2))
				.attr({x: 577, y: i * 16, z: 2});
		}
	}
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprite.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
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
		Crafty.c('CustomControls', {
			__move: {left: false, right: false, up: false, down: false},	
			_speed: 40,
			
			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;
				
				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(this.isDown("RIGHT_ARROW") && this.canMove) this.x += this._speed; 
					else if(this.isDown("LEFT_ARROW") && this.canMove) this.x -= this._speed; 
					else if(this.isDown("UP_ARROW") && this.canMove) this.y -= this._speed;
					else if(this.isDown("DOWN_ARROW") && this.canMove) this.y += this._speed;
				});
				
				return this;
			}
		});
		generateWorld();
		//create our player entity with some premade components
       // player = Crafty.e("VoidJet");
        //player2 = Crafty.e("VoidJet")
          //  .attr({x: 180, y: 174, z: 1});
        player3 = Crafty.e("VoidJet")
            .attr({x: 90, y: 73, z: 1});
            
        player3.toggleMovement();
//        player3.moveToTile(10,10);
        
        function whichBlock(x,y){
            // Each block is 40x40 pixels
            var column = Math.floor(x / 40);
            var row = Math.floor(y / 40);
            return {column: column, row: row};
        };
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
            block = whichBlock(e.realX, e.realY);
            alert("Block is at row:" + block.row + " column:" + block.column);
            
            var possibleSpots = possibleBlocks(block.row, block.column, 4);
            var spotsAsString = "";
            for(i=0;i<possibleSpots.length;i++){
                spotsAsString+= "Row: " + possibleSpots[i].row + " Column: " + possibleSpots[i].column + "\n";
            }
            alert("Possible spots\n" + spotsAsString);
    	});
	});
};        
        