let blockSize = 10;
let columns = 80;
let rows = 60;

let ctx = null;
let aliveColor = "#ff0000";
let deadColor = "#ffffff";

let state1 = Array( rows ).fill().map( () => Array( columns ).fill( 0 ) );
let state2 = Array( rows ).fill().map( () => Array( columns ).fill( 0 ) );

let oddCycle = true;

let glider = [
	[1, 0],
	[2, 1],
	[0, 2],
	[1, 2],
	[2, 2]
];


document.addEventListener('DOMContentLoaded', function(event) {
	ctx = document.getElementById( 'game' ).getContext( '2d' );

	setState( state1, glider );

	for( let i = 0; i < rows; i++ ) {
		for ( let j = 0; j < columns; j++ ) {
			if ( state1[ i ][ j ] ) {
				renderBlock( i, j );
			}
		}
	}

	document.getElementById( 'next' ).addEventListener( 'click', animateStep );	
});



function animateStep( ) { 

	let currentState = oddCycle ? state1 : state2;
	let newState = oddCycle ? state2 : state1;

	oddCycle = !oddCycle;

//	let newState = Array( rows ).fill().map( () => Array( columns ).fill( 0 ) );

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