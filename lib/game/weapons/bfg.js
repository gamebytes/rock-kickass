ig.module(
  'game.weapons.bfg'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponBfg = ig.Entity.extend({
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
    maxVel: { x: 500, y: 0 },
    friction: {x: 0, y: 0},

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    damageTimer: null,

    beamColor: 'green',
    beamThickness: 3,
    damagePerSecond: 10,
    range: 500,

    init: function(x, y, settings) {
      this.parent( x + (settings.flip ? -4 : 8), y + 8, settings);

      this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
      this.addAnim( 'idle', 0.2, [0] );

      this.damageTimer = new ig.Timer();
    },

    handleMovementTrace: function(res) {
      this.parent(res);

      if(res.collision.x || res.collision.y || res.collision.slope) {
        this.kill();
      }
    },

    check: function( other ) {
      other.receiveDamage(3, this);
      this.kill();
    },

    collideWith: function( other, axis ) {
      if( other ) {
        this.kill();
      }
    },

    update: function() {
      this.parent();

      var enemies = ig.game.getEntitiesByType('EntityEnemyBase');

      var relativeDamage = this.damageTimer.tick() * this.damagePerSecond;

      for (var i = 0; i < enemies.length; i++) {
        if (this.distanceTo(enemies[i]) < this.range) {
          enemies[i].receiveDamage(relativeDamage, this);
        }
      };
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
      };
    }
  });
});
