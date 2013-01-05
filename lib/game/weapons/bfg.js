ig.module('game.weapons.bfg')
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponBfg = ig.Entity.extend({
    inventoryData: {
      name: "WeaponBfg",
      displayName: 'BFG',
      playerAnimOffset: 0
    },
    
    size: { x: 31, y: 31 },
    offset: { x: 0, y: 0 },
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

      if (player.health <= 0
        || playerController.weapons[playerController.activeWeaponIndex].name != this.inventoryData.name) {
        this.kill()
      }

      if (player.flip) {
        this.pos = { x: player.pos.x - player.gunOffset.x - this.size.x / 2, y: player.pos.y + player.gunOffset.y / 2 };
      } else {
        this.pos = { x: player.pos.x + player.gunOffset.x + this.size.x / 2, y: player.pos.y + player.gunOffset.y / 2 };
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
    },
    
    getForInventory: function() {
      return this.inventoryData;
    }
  });

  EntityBfgProjectile = WeaponBase.extend({
    size: { x: 31, y: 31 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/bfg.png', 31, 31 ),
    maxVel: { x: 500, y: 0 },

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    damage: 200,

    damageTimer: null,

    beamColor: 'green',
    beamThickness: 3,
    damagePerSecond: 10,
    range: 500,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

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
          enemies[i].receiveDamage(relativeDamage, this);
        }
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
          var startX = ig.system.getDrawPos(this.pos.x - ig.game.screen.x);
          var startY = ig.system.getDrawPos(this.pos.y - ig.game.screen.y);
          
          var endX = ig.system.getDrawPos(enemies[i].pos.x - ig.game.screen.x);
          var endY = ig.system.getDrawPos(enemies[i].pos.y - ig.game.screen.y);
          
          ig.system.context.beginPath();
          ig.system.context.moveTo(startX,startY);
          ig.system.context.lineTo(endX,endY);
          ig.system.context.stroke();
          ig.system.context.closePath();
        }
      }
    }
  });
});
