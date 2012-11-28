ig.module(
  'game.weapons.shotgun'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponShotgun = ig.Entity.extend({
    getForInventory: function() {
      return {
        name: 'WeaponShotgun',
        displayName: 'Shotgun',
        playerAnimOffset: 2
      };
    },
    size: { x: 7, y: 5 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/shotgun_bullet.png', 7, 5 ),
    maxVel: { x: 400, y: 0 },
    friction: {x: 0, y: 0},

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function(x, y, settings) {
      this.parent( x + (settings.flip ? -4 : 8), y + 8, settings);

      this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
      this.addAnim( 'idle', 0.2, [0] );
    },

    handleMovementTrace: function(res) {
      this.parent(res);
      
      if(res.collision.x || res.collision.y || res.collision.slope) {
        this.kill();
      }
    },

    check: function( other ) {
      other.receiveDamage(20, this);
      this.kill();
    },

    collideWith: function( other, axis ) {
      if( other ) {
        this.kill();
      }
    }
  });
});
