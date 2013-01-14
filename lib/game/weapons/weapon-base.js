ig.module('game.weapons.weapon-base')
.requires(
  'impact.entity'
)
.defines(function() {
  // all weapons inherit from this base class
  WeaponBase = ig.Entity.extend({
    friction: {x: 0, y: 0},
    
    init: function(x, y, settings) {
      this.parent( x + (settings.flip ? - 4 : 8), y + 8, settings);

      this.vel.x = (settings.flip ? - this.maxVel.x : this.maxVel.x);
      this.addAnim( 'idle', 0.2, [0] );
    },

    check: function( other ) {
      other.receiveDamage(this.damage, this);
      this.kill();
    },

    handleMovementTrace: function(res) {
      this.parent(res);

      if(res.collision.x || res.collision.y || res.collision.slope) {
        this.kill();
      }
    },

    collideWith: function( other, axis ) {
      if( other ) {
        this.kill();
      }
    },
  });
});