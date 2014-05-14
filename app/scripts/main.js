contentLoaded(window,function() 
{
	"use strict";
	var TIM = {}
	TIM.TILESIZE = 65;

	TIM.Game = function(){
		// create an new instance of a pixi stage
		var stage = new PIXI.Stage(0xFFFFFF),
		w = 360,
		h = 480,
		renderer = PIXI.autoDetectRenderer(w,h),
		tiles = [];		

		this.init = function init(){
			// add the renderer view element to the DOM
			document.body.appendChild(renderer.view);
			requestAnimFrame( animate );
			stage.interactive = true;
			function animate() {
			    requestAnimFrame( animate );
			    // render the stage   
			    renderer.render(stage);
			}

			this.createBorder();
			this.createUI();
			this.addEvents();
		}

		this.createBorder = function(){
			 var b = new PIXI.Graphics();
			 b.lineStyle(4,0x776e65,1);
			 b.drawRect(2,2,w-4,h-4);
			 stage.addChild(b);
			 this.border = b;
		}

		this.createUI = function(){
			var t = new TIM.Tile(50,'2048',0xecc400,'#FFFFFF');
			t.x = w/2-t.size/2;
			t.y = 20;
			stage.addChild(t);

			var t = new PIXI.Text('Join the numbers and get to the 2048 tile!',{font: '14px Comic Sans MS'});
			t.y = 80;
			t.x = (w-t.width)/2;	
			stage.addChild(t);

			var g = new PIXI.Graphics;
			g.beginFill(0xbbada0,1);
			g.drawRect(0,0,305,305);
			stage.addChild(g);
			g.y = h-330;
			g.x = 27.5;

			this.tileContainer = g;

			this.positions = [];
			for (var i = 0; i < 4; i++) {
				this.positions[i] = [];
				for (var j = 0; j < 4; j++) {
					g.beginFill(0xccc0b4,1);
					g.drawRect(j*74+9,i*74+9,TIM.TILESIZE,TIM.TILESIZE);
					g.endFill();
					this.positions[i][j] = {x: j*74+9, y: i*74+9};
				};
			};

			this.startGame();
		}

		this.startGame = function(){
			this.createInteractiveTile(this.positions[0][0]);
			this.createInteractiveTile(this.positions[0][1]);
		}

		this.createInteractiveTile = function(position){
			var t = new TIM.Tile(65,2,0xeee4da,'#776e65');
			t.makeInteractive();
			t.x = position.x;
			t.y = position.y;
			tiles.push(t);
			this.tileContainer.addChild(t);
		}

		this.addEvents = function(){
			stage.mousedown = this.onTouchStart;
			stage.mouseup = this.onTouchEnd;
		}

		this.onTouchStart = function(event){
			this.mouseStartPoint = {x: event.originalEvent.x, y: event.originalEvent.y};
		}

		this.onTouchEnd = function(event){
			this.mouseEndPoint = {x: event.originalEvent.x, y: event.originalEvent.y};
			var deltaY = this.mouseEndPoint.y - this.mouseStartPoint.y,
			deltaX = this.mouseEndPoint.x - this.mouseStartPoint.x,
			angleInDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI,
			angleInDegrees = Math.round(angleInDegrees/90)*90,
			dir;
			switch(angleInDegrees){
				case -90:
					dir = 'Up';
					break;
				case 0:
					dir = 'Left';
					break;
				case 90:
					dir = 'Down';
					break;
				case -180:
				case 180:
					dir = 'Right';
					break;
			}

			tiles.forEach(function(tile){
				tile['move'+dir]();
			})

		}

	}

	TIM.Tile = function(size,text,fillcolor,textColor){
		text = text.toString();
		this.size = size;
		this.text = text;
		this.textColor = textColor;
		this.fillcolor = fillcolor;
		PIXI.Graphics.call( this );
		this.beginFill(fillcolor,1);
		this.drawRect(2,2,size-4,size-4);
		this.endFill();

		var fontSize = Math.round((52/text.length));
		console.log(text);

		this.label = new PIXI.Text(text,{font: fontSize+'px Comic Sans MS', align: 'center', fill: textColor});
		this.addChild(this.label);
		this.label.x = (this.size - this.label.width)/2;
		this.label.y = (this.size - this.label.height)/2;

		this.makeInteractive = function(){

		}

		this.moveRight = function()
		{
			var newPos = {x: this.x - (TIM.TILESIZE+9), y: this.y};
			if(this.x > 9){
				TweenMax.to(this,.5,{x: newPos.x, onComplete: this.double, onCompleteScope: this});
			}
		}

		this.double = function()
		{
			this.label.setText(parseInt(this.text)*2);
		}

		this.moveLeft = function()
		{

		}

		this.moveUp = function()
		{

		}

		this.moveDown = function()
		{

		}
	}

	TIM.Tile.prototype = Object.create( PIXI.Graphics.prototype );
	TIM.Tile.prototype.constructor = PIXI.Tile;

	var game = new TIM.Game();
	game.init();
});

