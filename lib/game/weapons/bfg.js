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

      ig.game.spawnEntity( EntityBfg, pos.x, pos.y, { flip: player.flip });
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

      this.addAnim( 'idle', 0.2, [0] );

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

      if (player.flip) {
        this.pos = { x: player.pos.x - player.gunOffset.x - this.size.x / 2, y: player.pos.y + player.gunOffset.y / 2 };
      } else {
        this.pos = { x: player.pos.x + player.gunOffset.x, y: player.pos.y + player.gunOffset.y / 2 };
      }

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
    animSheet: new ig.AnimationSheet( 'media/bfg.png', 31, 31 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 500, y: 0 },
    
    damage: 200,

    damageTimer: null,

    beamColor: 'green',
    beamThickness: 3,
    damagePerSecond: 10,
    range: 500,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim( 'idle', 0.2, [0] );

      this.damageTimer = new ig.Timer();
    },

    update: function() {
      this.parent();

      var player = ig.game.player;

      var damagePercent = this.damageTimer.tick();
      var relativeDamage = this.damagePerSecond * damagePercent;

      var enemies = ig.game.getEntitiesByType('EntityEnemyBase');

      for (var i = 0; i < enemies.length; i++) {
        if (this.distanceTo(enemies[i]) < this.range) {
          enemies[i].receiveDamage(relativeDamage, this, false);
        }
      }

      if (this.distanceTo(player) < this.range) {
        player.receiveDamage(relativeDamage, this, false);
      }
    },

    draw: function() {
      this.parent();

      var player = ig.game.player;

      ig.system.context.strokeStyle = this.beamColor;
      ig.system.context.lineWidth = this.beamThickness;

      var enemies = ig.game.getEntitiesByType('EntityEnemyBase');

      for (var i = 0; i < enemies.length; i++) {
        if (this.distanceTo(enemies[i]) < this.range) {
          this.drawLaser(enemies[i]);
        }
      }

      if (this.distanceTo(player) < this.range) {
        this.drawLaser(player);
      }
    },

    drawLaser: function( entity ) {
      var context = ig.system.context;
      
      var startX = ig.system.getDrawPos(this.pos.x - ig.game.screen.x);
      var startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y);
      
      var endX = ig.system.getDrawPos(entity.pos.x + entity.size.x / 2 - ig.game.screen.x);
      var endY = ig.system.getDrawPos(entity.pos.y + entity.size.y / 2 - ig.game.screen.y);
      
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
      context.closePath();
    }
  });
});
