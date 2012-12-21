ig.module(
  'game.entities.effect-weapon-acquired'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityEffectWeaponAcquired = ig.Entity.extend({
    lifetimeTimer: null,
    lifetime: 3,

    friction: {x: 0, y: 0},
    maxVel: { x: 0, y: -10 },
    vel: { x: 0, y: -10 },

    lastDelta: 0,

    weaponName: null,

    init: function ( x, y, settings ) {
      this.parent( x, y, settings);

      this.weaponName = settings.weaponName;
      this.lifetimeTimer = new ig.Timer();
    },

    update: function() {
      this.parent();
      
      var delta = this.lifetimeTimer.delta();

      if( delta > this.lifetime ) {
        this.kill();
      }
      
      var effectsToSpawn = (delta - this.lastDelta) * 100;

      this.lastDelta = delta;

      var player = ig.game.player;
      var x = ig.game.camera.calculatePosition('x', player.pos.x);
      var y = ig.game.camera.calculatePosition('y', player.pos.y);

      for( var i = 0; i < effectsToSpawn; i++ ) {
        ig.game.spawnEntity(EntityEffectWeaponAcquiredParticle, player.pos.x, player.pos.y);
      }
    },

    draw: function () {
      var player = ig.game.player;
      var x = ig.game.camera.calculatePosition('x', player.pos.x);
      var y = ig.game.camera.calculatePosition('y', player.pos.y) - 20;

      ig.system.context.globalAlpha = this.lifetimeTimer.delta().map(1, this.lifetime, 1, 0);;
      ig.game.font.draw( this.weaponName + ' acquired!', x, y, '#000000' );
      ig.system.context.globalAlpha = 1;
    }
  });

  EntityEffectWeaponAcquiredParticle = ig.Entity.extend({
    size: {x: 4, y: 4},
    maxVel: {x: 300, y: 250},
    lifetime: 1,
    fadetime: 1,
    bounciness: 0.7,
    vel: {x: 60, y: 200},
    friction: {x:20, y: 20},
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.LITE,
    animSheet: new ig.AnimationSheet( 'media/explosion.png', 4, 4 ),
    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
      this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
      this.idleTimer = new ig.Timer();
      var frameID = Math.round(Math.random()*7);
      this.addAnim( 'idle', 0.1, [frameID], true );
    },
    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }
      this.currentAnim.alpha = this.idleTimer.delta().map(
        this.lifetime - this.fadetime, this.lifetime, 1, 0
      );
      this.parent();
    }
  });
});
