ig.module('game.weapons.bfg')
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponBfg = WeaponBase.extend({
    getForInventory: function() {
      return {
        name: "WeaponBfg",
        displayName: 'BFG',
        playerAnimOffset: 0
      }
    },
    size: { x: 5, y: 3 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/bfg.png', 20, 20 ),
    maxVel: { x: 0, y: 0 },
    friction: {x: 0, y: 0},

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    damage: 200,

    damageTimer: null,
    powerUpTimer: null,

    beamColor: 'green',
    beamThickness: 3,
    damagePerSecond: 10,
    range: 500,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.damageTimer = new ig.Timer();
      this.powerUpTimer = new ig.Timer(2);
    },

    update: function() {
      this.parent();

      var player = ig.game.player;
      var damagePercent = this.damageTimer.tick();

      if(this.powerUpTimer.delta() < 0) {
        if (player.flip) {
          this.pos = { x: player.pos.x - player.gunOffset.x, y: player.pos.y + player.gunOffset.y };
        } else {
          this.pos = { x: player.pos.x + player.gunOffset.x, y: player.pos.y + player.gunOffset.y };
        }
      } else {
        this.maxVel = { x: 500, y: 0 };
        this.vel = { x: 500, y: 0 };

        if (player.flip) {
          this.vel.x *= -1;
        }

        var enemies = ig.game.getEntitiesByType('EntityEnemyBase');

        var relativeDamage = this.damagePerSecond * damagePercent;

        for (var i = 0; i < enemies.length; i++) {
          if (this.distanceTo(enemies[i]) < this.range) {
            enemies[i].receiveDamage(relativeDamage, this);
          }
        };
      }
    },

    draw: function() {
      this.parent();

      if(this.powerUpTimer.delta() >= 0) {
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
    }
  });
});
