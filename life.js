
let glider = [
	[1, 0],
	[2, 1],
	[0, 2],
	[1, 2],
	[2, 2]
];


let Render = function () { 
	let blockSize = 10;

	let ctx = null;
	let aliveColor = "#ff0000";
	let deadColor = "#ffffff";

	let lastPaintedPixel = null;
	let isPainting = false;

	function paint( event ) {
		let point = getCursorPosition( event );

		if ( !lastPaintedPixel || ( lastPaintedPixel.x != point.x || lastPaintedPixel.y != point.y ) ) { 

			let newstate = game.getState( point.x, point.y ) ? 0 : 1;
			renderBlock(point.x, point.y, newstate );
			game.setState( point.x, point.y, newstate );

			lastPaintedPixel = point;
		}
	}

	function renderBlock ( x, y, active = true ) {
		if( active ) {
			ctx.fillStyle = aliveColor;
		} else {
			ctx.fillStyle = deadColor;
		}

		ctx.fillRect( x * blockSize, y * blockSize, blockSize, blockSize );
	}

	function reset () {
		ctx.fillStyle = deadColor;		
		ctx.fillRect( 0, 0, 800, 600 );		
	}

	function getCursorPosition( event ) {
		const x = event.offsetX;
		const y = event.offsetY;

		return {
			x: parseInt( x / blockSize ) ,
			y: parseInt( y / blockSize )
		}
	}
	return {
		onmousedown: function( event ) {
			game.stopAnimation();

			paint( event );

			isPainting = true;
		}, 
		onmousemove : function( event ) {
			if ( isPainting ) {
				paint( event );
			}
		}, 
		onmouseup: function( event ) {
			lastPaintedPixel = null;
			isPainting = false;
		}, 
		init: function ( context ) {
			ctx = context;
		},
		renderBlock: renderBlock,
		reset: reset
	}

};

render = new Render();

document.addEventListener('DOMContentLoaded', function(event) {

	const canvas = document.getElementById( 'game' );
	render.init( canvas.getContext( '2d' ) );

	game.init();

	document.getElementById( 'reset' ).addEventListener( 'click', game.reset );	
	document.getElementById( 'pause' ).addEventListener( 'click', game.stopAnimation );	
	document.getElementById( 'next' ).addEventListener( 'click', game.animateStep );	
	document.getElementById( 'play' ).addEventListener( 'click', game.startAnimation );		
	
	canvas.addEventListener( 'mousedown', render.onmousedown );
	canvas.addEventListener( 'mousemove', render.onmousemove );	
	canvas.addEventListener( 'mouseup', render.onmouseup );		
});

