let blockSize = 10;
let columns = 60;
let rows = 80;

let ctx = null;
let aliveColor = "#ff0000";
let deadColor = "#ffffff";

let state1 = Array( rows ).fill().map( () => Array( columns ).fill( 0 ) );
let state2 = Array( rows ).fill().map( () => Array( columns ).fill( 0 ) );

let currentState = state1;
let newState = state2;

let animationTimeout = null;

let oddCycle = true;

let glider = [
	[1, 0],
	[2, 1],
	[0, 2],
	[1, 2],
	[2, 2]
];


document.addEventListener('DOMContentLoaded', function(event) {
	const canvas = document.getElementById( 'game' );
	ctx = canvas.getContext( '2d' );

	setState( state1, glider );

	for( let i = 0; i < rows; i++ ) {
		for ( let j = 0; j < columns; j++ ) {
			if ( state1[ i ][ j ] ) {
				renderBlock( i, j );
			}
		}
	}
	document.getElementById( 'pause' ).addEventListener( 'click', stopAnimation );	
	document.getElementById( 'next' ).addEventListener( 'click', animateStep );	
	document.getElementById( 'play' ).addEventListener( 'click', startAnimation );		

	canvas.addEventListener( 'mousedown', function(event) {
		stopAnimation();

		let point = getCursorPosition( canvas, event );

		currentState[ point.x ][ point.y ] = currentState[ point.x ][ point.y ] ? 0 : 1;
		renderBlock(point.x, point.y, currentState[ point.x ][ point.y ] );

	});
});


function stopAnimation () {
	clearInterval( animationTimeout );
	animationTimeout = null;
}


function startAnimation () {
	if (! animationTimeout ) {
		animationTimeout = setInterval( animateStep, 400 );
	}
}

function getCursorPosition( canvas, event ) {
	const rect = canvas.getBoundingClientRect();

	const x = event.offsetX;
	const y = event.offsetY;

	return {
		x: parseInt( x / blockSize ) ,
		y: parseInt( y / blockSize )
	}
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
				renderBlock( i, j, newState[ i ][ j ]);
			} 
		}
	}	

	currentState = oddCycle ? state1 : state2;
	newState = oddCycle ? state2 : state1;

	oddCycle = !oddCycle;
}

function setState( stateTable, data = [] ) {
	data.forEach( cell => stateTable[ cell[ 0 ] ][ cell[ 1 ] ] = 1 );
}

function renderBlock ( x, y, active = true ) {
	if( active ) {
		ctx.fillStyle = aliveColor;
	} else {
		ctx.fillStyle = deadColor;
	}

	ctx.fillRect( x * blockSize, y * blockSize, blockSize, blockSize );
}