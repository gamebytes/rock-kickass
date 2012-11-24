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
  'game.entities.instant-earthquake'
)
.requires(
  'impact.entity',
  'game.entities.earthquake'
)
.defines(function(){

EntityInstantEarthquake = ig.Entity.extend({
  _wmDrawBox: true,
  _wmBoxColor: 'rgba(80, 130, 170, 0.7)',

  size: {x: 8, y: 8},

  duration: 1,
  strength: 8,
  quakeTimer: null,

  init: function( x, y, settings ) {
    this.quakeTimer = new ig.Timer();
    this.parent( x, y, settings );

    // spawn a new earthquake entity
    var quake = ig.game.spawnEntity( EntityEarthquake, x, y, { duration: 1, strength: 3 });

    quake.triggeredBy( this, this );
  }
});

});
