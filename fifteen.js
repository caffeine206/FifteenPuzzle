// Derek Willms CSE 154 Section AD HW#8 5/31/13
// fifteen.js is a javascript file that constructs and runs a game of fifteen
// puzzle for a webpage, including tile moving functionality and a working shuffle button

"use strict";

(function() {
	var emptySquareCol; // current column of empty square
	var emptySquareRow; // current row of empty square
	var SQR_SIZE = 100; // constant for pixel size of squares
	var BOARD_SIZE = 4; // constant for number of rows/columns
	
	// initializes the elements of the page after it loads
	window.onload = function() {
		emptySquareCol = BOARD_SIZE;
		emptySquareRow = BOARD_SIZE;
		document.getElementById("shufflebutton").onclick = shuffle;
		setUpSquares();
	};
	
	// puts all the squares in the board area with their appropriate functions, background,
	// and numbers
	function setUpSquares() {
		var puzzlearea = document.getElementById("puzzlearea");
		var xpos = 0;
		var ypos = 0;
		
		for (var i = 1; i < 16; i++) {
			var square = document.createElement("div");
			square.className = "square";
			if (xpos > 300) {
				xpos = 0;
				ypos += SQR_SIZE;
			}
			square.id = "square_" + (ypos / SQR_SIZE + 1) + "_" + (xpos / SQR_SIZE + 1);
			square.style.position = "absolute";
			square.style.backgroundPosition = -xpos + "px " + -ypos + "px";
			square.style.left = xpos + "px";
			square.style.top = ypos + "px";
			square.onclick = analyzeSquare;
			square.onmouseover = highlightOn;
			square.onmouseout = highlightOff;
			puzzlearea.appendChild(square);
			xpos += SQR_SIZE;
			
			var number = document.createElement("div");
			number.className = "number";
			number.innerHTML = i;
			square.appendChild(number);
		}
	}
	
	// checks if it is safe to trade the position of a clicked square with the empty square
	// if so, performs the positional switch
	function analyzeSquare() {
		if (safeToMove(this)) {
			moveSquare(this);
		}
	}
	
	// switches the position of the empty square with the clicked square
	function moveSquare(square) {
		var x = parseInt(window.getComputedStyle(square).left);
		var y = parseInt(window.getComputedStyle(square).top);
		square.style.left = emptySquareCol * SQR_SIZE - SQR_SIZE + "px";
		square.style.top  = emptySquareRow * SQR_SIZE - SQR_SIZE + "px";
		square.id = "square_" + emptySquareRow + "_" + emptySquareCol;
		emptySquareCol = (x + SQR_SIZE) / SQR_SIZE;
		emptySquareRow = (y + SQR_SIZE) / SQR_SIZE;
	}
	
	// checks if it is safe to trade the position of a clicked square with the empty square
	function safeToMove(square) {
		var x = parseInt(window.getComputedStyle(square).left);
		var y = parseInt(window.getComputedStyle(square).top);
		var xDist = Math.abs(x - (emptySquareCol * SQR_SIZE - SQR_SIZE));
		var yDist = Math.abs(y - (emptySquareRow * SQR_SIZE - SQR_SIZE));
		return (xDist + yDist == SQR_SIZE);
	}
	
	// makes a square highlighted if the mouse is resting on it and it is eligible
	// to switch with the empty square
	function highlightOn() {
		var x = parseInt(window.getComputedStyle(this).left);
		var y = parseInt(window.getComputedStyle(this).top);
		if (safeToMove(this)) {
			this.className = "highlight";
		}
	}
	
	// removes the highlight from the square when the mouse is no longer hovering on it
	function highlightOff() {
		this.className = "square";
	}
	
	// randomly moves the position of the empty square to an eligible neighbor 1000 times
	// to shuffle the squares on the board
	function shuffle() {
		for (var j = 0; j < 999; j++) {
			var safeNeighbors = [];
			var neighbors = [grabSquare(emptySquareRow - 1, emptySquareCol), 
					grabSquare(emptySquareRow + 1, emptySquareCol), 
					grabSquare(emptySquareRow, emptySquareCol - 1), 
					grabSquare(emptySquareRow, emptySquareCol + 1)];
			for (var i = 0; i < neighbors.length; i++) {
				if (neighbors[i]) {
					safeNeighbors.push(neighbors[i]);
				}	
			}
			var index = parseInt(Math.random() * safeNeighbors.length);
			moveSquare(safeNeighbors[index]);
		}
	}
	
	// returns a particular square in a given row and column
	function grabSquare(row, col) {
		return document.getElementById("square_" + row + "_" + col);
	}
})();