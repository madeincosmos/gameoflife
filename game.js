
let Game = function () {
	let columns = 60;
	let rows = 80;

	let state1 = Array( rows ).fill().map( () => Array( columns ).fill( 0 ) );
	let state2 = Array( rows ).fill().map( () => Array( columns ).fill( 0 ) );

	let currentState = state1;
	let newState = state2;

	let animationTimeout = null;	

	let oddCycle = true;

	function setState( stateTable, data = [] ) {
		data.forEach( cell => stateTable[ cell[ 0 ] ][ cell[ 1 ] ] = 1 );
	}	

	function animateStep( ) { 

		for( let i = 0; i < rows; i++ ) {
			for ( let j = 0; j < columns; j++ ) {
				let neighbors = 0;

				if ( i > 0 ) {
					if ( j > 0 ) {
						neighbors += currentState[ i-1 ][ j-1 ];
					}
					neighbors += currentState[ i-1 ][ j ];
					if ( j < columns-1 ) {
						neighbors += currentState[ i-1 ][ parseInt(j)+1 ];
					}				
				} 

				if( i < rows-1 ) {
					if ( j > 0 ) {
						neighbors += currentState[ parseInt(i)+1 ][ j-1 ];
					}
					neighbors += currentState[ parseInt(i)+1 ][ j ];
					if ( j < columns-1 ) {
						neighbors += currentState[ parseInt(i)+1 ][ parseInt(j)+1 ];
					}				
				}

				if ( j > 0 ) {
					neighbors += currentState[ i ][ j-1 ];
				}

				if ( j < columns-1 ) {
					neighbors += currentState[ i ][ parseInt(j)+1 ];
				}	

				if ( neighbors == 3 ) {
					newState[ i ][ j ] = 1;
				} else if ( neighbors == 2 && currentState[ i ][ j ] == 1 ) {
					newState[ i ][ j ] = 1;
				} else {
					newState[ i ][ j ] = 0;
				}

				if ( currentState[ i ][ j ] != newState[ i ][ j ] ) {
					render.renderBlock( i, j, newState[ i ][ j ]);
				} 
			}
		}	

		currentState = oddCycle ? state1 : state2;
		newState = oddCycle ? state2 : state1;

		oddCycle = !oddCycle;
	}	

	function stopAnimation () {
		clearInterval( animationTimeout );
		animationTimeout = null;
	}


	function startAnimation () {
		if (! animationTimeout ) {
			animationTimeout = setInterval( animateStep, 400 );
		}
	}	

	function reset() {
		stopAnimation();
		for( let i = 0; i < rows; i++ ) {
			for ( let j = 0; j < columns; j++ ) {	
				currentState[ i ][ j ] = 0;
			}
		}	
		render.reset();
	}

	return {
		init: function () {
			setState( state1, glider );

			for( let i = 0; i < rows; i++ ) {
				for ( let j = 0; j < columns; j++ ) {
					if ( state1[ i ][ j ] ) {
						render.renderBlock( i, j );
					}
				}
			}			
		},
		animateStep: animateStep,
		stopAnimation: stopAnimation,
		startAnimation: startAnimation,
		getState: function ( x, y ) {
			return currentState[ x ][ y ];
		},
		setState: function ( x, y, value ) {
			currentState[ x ][ y ] = value; 
		},
		reset: reset
	}
}

let game = new Game();