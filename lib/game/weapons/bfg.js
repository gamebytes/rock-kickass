ig.module('game.weapons.bfg')
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponBfg = ig.Class.extend({
    name: "WeaponBfg",
    displayName: 'BFG',
    playerAnimOffset: 0,
    hudImage: new ig.Image( 'media/hud-bullet.png' ),
    shootSFX: new ig.Sound('media/sounds/pistol_shoot.*'),

    fire: function() {
      var player = ig.game.player;
      var pos = player.getProjectileStartPosition();

      ig.game.spawnEntity( EntityBfgProjectile, pos.x, pos.y - 20, {
        flip: player.flip,
        checkAgainst: ig.Entity.TYPE.B,
        vel: { x: 500, y: 0 },
        maxVel: { x: 600, y: 0 },
        damage: 70
      });
      this.shootSFX.play();
    }
  });

  EntityBfg = ig.Entity.extend({
    size: { x: 31, y: 31 },
    animSheet: new ig.AnimationSheet( 'media/bfg.png', 31, 31 ),

    powerUpTime: 2,
    powerUpTimer: null,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim( 'idle', 0.2, [0,1,2,3,4,5,6,7,8,9,10,11] );

      this.powerUpTimer = new ig.Timer(this.powerUpTime);
    },

    update: function() {
      var player = ig.game.player;
      var playerController = ig.game.playerController;

      // If player dies, or switches weapons, cancel
      // if (player.health <= 0
      //   || playerController.weapons[playerController.activeWeaponIndex].name != this.inventoryData.name) {
      //   this.kill();
      // }

      // if (player.flip) {
      //   this.pos = { x: player.pos.x - player.gunOffset.x - this.size.x / 2, y: player.pos.y + player.gunOffset.y / 2 };
      // } else {
      //   this.pos = { x: player.pos.x + player.gunOffset.x, y: player.pos.y + player.gunOffset.y / 2 };
      // }

      if (this.powerUpTimer.delta() >= 0) {
        ig.game.spawnEntity( EntityBfgProjectile, this.pos.x, this.pos.y, { flip: player.flip });

        this.kill();
      }

      if (player.standing && player.vel.x == 0) {
        player.currentAnim = player.anims.idleFire;
        player.currentAnim.flip.x = player.flip;
      }
    },

    draw: function() {
      var strength = this.powerUpTime + this.powerUpTimer.delta();

      var drawCount = strength / (this.powerUpTime / 10);

      for (var i = 0; i < drawCount; i++) {
        this.parent();
      };

      this.parent();
    }
  });

  EntityBfgProjectile = WeaponBase.extend({
    size: { x: 31, y: 31 },
    animSheet: new ig.AnimationSheet( 'media/bfg.png', 40, 40 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 300, y: 200 },

    damage: 200,

    damageTimer: null,

    beamColor: 'green',
    beamThickness: 3,
    damagePerSecond: 10,
    range: 500,
    particles: 16,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim( 'idle', 0.04, [0,1,2,3,4,5,6,7,8,9,10,11] );

      this.damageTimer = new ig.Timer();
    },

    update: function() {
      this.parent();
    },

    draw: function() {
      // apply the current rotation, if there is one
      if( this.rotation )
        this.currentAnim.angle = 180/Math.PI * this.rotation;

      this.parent();
    },

    kill: function() {
      this.parent();

      ig.game.spawnEntity( EntityInstantEarthquake, this.pos.x, this.pos.y, { duration: 1, strength: 5 });

      for(var i = 0; i < this.particles; i++)
        ig.game.spawnEntity(EntityBfgParticle, this.pos.x, this.pos.y, { checkAgainst: this.checkAgainst });
    }
  });

  EntityBfgParticle = ig.Entity.extend({
    size: {x: 4, y: 4},
    maxVel: {x: 300, y: 250},
    lifetime: 1,
    fadetime: 1,
    bounciness: 0.7,
    vel: {x: 60, y: 200},
    friction: {x:20, y: 20},
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.LITE,
    animSheet: new ig.AnimationSheet( 'media/explosion.png', 4, 4 ),
    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
      this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
      this.idleTimer = new ig.Timer();
      var frameID = [8,9][Math.round(Math.random()*2)];
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
    },
    check: function(other) {
      other.receiveDamage(2, this);
      this.kill();
    }
  });
});
