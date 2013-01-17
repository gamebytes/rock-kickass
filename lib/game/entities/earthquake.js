/*
This entity shakes the screen when its triggeredBy() method is called - usually
through an EntityTrigger entity.


Keys for Weltmeister:

strength
	max amount of screen movement in pixels
	default: 8

duration
	duration of the screen shaking in seconds
	default: 1
*/

ig.module(
	'game.entities.earthquake'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityEarthquake = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(80, 130, 170, 0.7)',

	size: {x: 8, y: 8},

	duration: 2,
	strength: 6,
	quakeTimer: null,
	sound: new ig.Sound('media/sounds/earthquake.*', false),

	originalLocation: null,

	init: function( x, y, settings ) {
		if( settings.duration ) {
			this.duration = settings.duration;
		}

		this.quakeTimer = new ig.Timer();
		this.parent( x, y, settings );
	},


	triggeredBy: function( entity, trigger ) {
		this.quakeTimer.set( this.duration );

		if(this.sound)
      this.sound.play();

		this.originalLocation = { x: ig.game.camera.offset.x, y: ig.game.camera.offset.y };
	},


	update: function() {
		var delta = this.quakeTimer.delta();

		if( delta < -0.1 ) {
			var s = this.strength * Math.pow( -delta / this.duration, 2 );

			if( s > 0.5 ) {
				ig.game.camera.offset.x += Math.random().map( 0, 1, -s, s );
				ig.game.camera.offset.y += Math.random().map( 0, 1, -s, s );

				if(Math.abs(ig.game.camera.offset.x - this.originalLocation.x) > this.strength) {
					ig.game.camera.offset.x = this.originalLocation.x;
				}

				if(Math.abs(ig.game.camera.offset.y - this.originalLocation.y) > this.strength) {
					ig.game.camera.offset.y = this.originalLocation.y;
				}
			}
		} else {
			this.kill();
		}
	},

	kill: function() {
		ig.game.camera.offset.x = this.originalLocation.x;
		ig.game.camera.offset.y = this.originalLocation.y;

		this.parent();
	}
});

});
