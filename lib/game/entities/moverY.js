/*
Simple Mover that visits all its targets in an ordered fashion. You can use
the void entities (or any other) as targets.


Keys for Weltmeister:

speed
	Traveling speed of the mover in pixels per second.
	Default: 20
	
target.1, target.2 ... target.n
	Names of the entities to visit.
*/

ig.module(
	'game.entities.moverY'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityMoverY = ig.Entity.extend({
	size: {x: 48, y: 16},
	maxVel: {x: 100, y: 100},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.FIXED,
	
	target: null,
	targets: [],
	currentTarget: 0,
	speed: 50,
	gravityFactor: 0,
	
	animSheet: new ig.AnimationSheet( 'media/platform.png', 48, 16 ),
	
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );

		// Transform the target object into an ordered array of targets
		this.targets = ig.ksort( this.target );
	},
	
	
	update: function() {
		var oldDistance = 0;
		var target = ig.game.getEntityByName( this.targets[this.currentTarget] );

		if( target ) {
			var distance = this.pos.y - target.pos.y;

			oldDistance = Math.abs( distance );
			
			this.vel.y = (distance > 0) ? -this.speed : this.speed;
		} else {
			this.vel.x = 0;
			this.vel.y = 0;
		}
		
		this.parent();
		
		// Are we close to the target or has the distance actually increased?
		// -> Set new target
		var newDistance = Math.abs( this.pos.y - target.pos.y );

		if( target && (newDistance > oldDistance || newDistance < 0.5) ) {
			this.currentTarget++;
			if( this.currentTarget >= this.targets.length && this.targets.length > 1 ) {
				this.currentTarget = 0;
			}
		}
	}
});

});