ig.module( 'game.weapons.shotgun' )
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponShotgun = WeaponBase.extend({
    inventoryData: {
      name: 'WeaponShotgun',
      displayName: 'Shotgun',
      playerAnimOffset: 2,
      hudImage: new ig.Image( 'media/hud-shotgun.png' ),
      shootSFX: new ig.Sound('media/sounds/shotgun_shoot.*')
    },

    particleCount: 5,

    init: function(x, y, settings) {
      this.parent( x, y, settings );

      if(ig.game.player) {
        var player = ig.game.player;

        for( var i = 0; i < this.particleCount; i++ ) {
          ig.game.spawnEntity( EntityShotgunParticle, this.pos.x, this.pos.y, { flip: settings.flip } );
        }

        this.kill();
      }
    }
  });

  EntityShotgunParticle = WeaponBase.extend({
    size: {x: 4, y: 4},
    animSheet: new ig.AnimationSheet( 'media/explosion.png', 4, 4 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.NEVER,

    maxVel: {x: 700, y: 0},
    vel: {x: 600, y: 0},

    damage: 3,
    lifetime: 0.3,

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
    }
  });
});
