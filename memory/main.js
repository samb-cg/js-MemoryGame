

class MemoryGame{
	
	constructor(svg){

		this.totalRects = 4;
		this.rectW = 80;

		this.svg = svg;
		this.svgWidth = svg.clientWidth;
		this.svgHeight = svg.clientHeight;

		this.activeRects = [];

		this.rectClickCount = 0;
		this.gameOver = false;
		this.controlsLocked = false;

		this.blue = "rgb(137, 222, 255)";
	}

	init(){

		for(var i = 0; i<this.totalRects; i++){
			var aX = this.getRandomPos(this.svgWidth);
			var aY = this.getRandomPos(this.svgHeight);

			if(this.colCheck(aX,aY)){
				i--;
			}else{
				var rect = this.createRect(aX,aY,i);
				var text = this.createText(aX,aY,i);

				this.activeRects.push({svg:rect,text:text,x:aX,y:aY});

				this.svg.appendChild(rect);
				this.svg.appendChild(text);
			}

		}

	}

	startGame(){
		for(let i = 0; i< this.activeRects.length; i++){
			this.activeRects[i].svg.style.fill = "black";
			this.activeRects[i].text.innerHTML = ".";
		}
	}

	handleRectClick(num){
		if(this.gameOver || !this.controlsLocked) return;
		if(num === 0 && this.rectClickCount === 0) this.startGame();
		if(num > this.rectClickCount) this.initGameOver();
		if(num === this.rectClickCount){
			this.activeRects[num].svg.style.fill = this.blue;
			this.activeRects[num].text.innerHTML = num;
			this.rectClickCount++;
		};
		if(this.rectClickCount === this.totalRects)this.initNextLevel();
	}

	initGameOver(){
		this.gameOver = true;
		this.toggleBlocker();
		document.getElementById("playBtn").style.display = "none";
		document.getElementById("resetBtn").style.display = "inline";
		document.getElementById("startText").style.display = "none";
		document.getElementById("gameOverText").style.display = "inline";
		document.getElementById("score").innerHTML = this.totalRects;
	}

	initNextLevel(){
		this.totalRects++;
		this.svg.innerHTML = "";
		this.activeRects = [];
		this.rectClickCount = 0;
		this.init();
	}

	createText(x,y,number){
	    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	    text.innerHTML = number;
	    text.setAttribute("x", x+25);
	    text.setAttribute("y", y+60);
	    text.setAttribute("class", "text");
	    return text;
	}

	colCheck(aX,aY){
		var col = false;
		for(var o = 0; o < this.activeRects.length; o++){

			var bX = this.activeRects[o].x;
			var bY = this.activeRects[o].y;
			var length = this.rectW;

			if( aX < bX+length && 
				aX + length > bX &&
				aY < bY+length &&
				aY +length > bY) {
				col = true;
			}
		}
		return col;
	}

	play(){
		this.controlsLocked = true;
		this.toggleBlocker();
	}

	toggleBlocker(){
	    const memoryBlocker = document.getElementById("blocker");

	    if(memoryBlocker.style.display === " " || memoryBlocker.style.display === "none"){
	        memoryBlocker.style.display = "flex";
	    }else{
	        memoryBlocker.style.display = "none";
	    }		
	}

	reset(){
		this.svg.innerHTML = "";
		this.activeRects = [];
		this.gameOver = false;
		this.totalRects = 4;
		this.rectClickCount = 0;
		document.getElementById("playBtn").style.display = "inline";
		document.getElementById("resetBtn").style.display = "none";
		document.getElementById("startText").style.display = "inline";
		document.getElementById("gameOverText").style.display = "none";
		this.init();
	}

	getRandomPos(axisSize){
		var randomNum = Math.floor(Math.random()*(axisSize - this.rectW));
		return randomNum;
	}

	createRect(x,y,i){
	    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	    rect.setAttribute("x", x);
	    rect.setAttribute("y", y);
	    rect.setAttribute("rx", 20);
	    rect.setAttribute("ry", 20);
	    rect.setAttribute("width", this.rectW);
	    rect.setAttribute("height", this.rectW);
	    rect.setAttribute("class", "rectangle");
	    rect.onclick = ()=>{
	    	this.handleRectClick(i);
	    };
	    return rect;
	}

}

const memorySvg = document.getElementById("mySvg");
var memoryGame = new MemoryGame(memorySvg);
memoryGame.init();

const memoryPlayBtn = document.getElementById("playBtn");
memoryPlayBtn.onclick = ()=>{memoryGame.play()};

const memoryResetBtn = document.getElementById("resetBtn");
memoryResetBtn.onclick = ()=>{memoryGame.reset()};