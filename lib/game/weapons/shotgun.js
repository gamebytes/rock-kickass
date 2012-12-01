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
    maxVel: { x: 400, y: 0 },
    friction: {x: 0, y: 0},

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    particleCount: 5,

    init: function(x, y, settings) {
      this.parent( x + (settings.flip ? -4 : 8), y + 8, settings);

      if(ig.game.player) {
        var player = ig.game.player;

        for( var i = 0; i < this.particleCount; i++ ) {
          ig.game.spawnEntity( EntityShotgunParticle, this.pos.x, this.pos.y, { flip: settings.flip } );
        }

        this.kill();
      }
    }
  });

  EntityShotgunParticle = ig.Entity.extend({
    size: {x: 4, y: 4},
    maxVel: {x: 700, y: 0},
    lifetime: 0.3,
    vel: {x: 600, y: 0},
    friction: { x: 0, y: 0},
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,
    animSheet: new ig.AnimationSheet( 'media/explosion.png', 4, 4 ),
    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.vel.x = (Math.random() * 100) + this.vel.x;
      this.vel.y = (Math.random() * 10 - 5) * 20;

      if( settings.flip ) {
        this.vel.x *= -1;
        this.vel.y *= -1;
      }

      this.maxVel.y = this.vel.y;
      this.idleTimer = new ig.Timer();
      var frameID = Math.round(Math.random()*7);
      this.addAnim( 'idle', 0.1, [frameID], true );
    },

    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }

      this.parent();
    },

    check: function(other) {
      other.receiveDamage(2, this);
      this.kill();
    },

    handleMovementTrace: function(res) {
      this.parent(res);

      if(res.collision.x || res.collision.y || res.collision.slope) {
        this.kill();
      }
    },
  });
});
