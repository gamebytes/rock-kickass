ig.module('game.weapons.enemy-rocket-launcher')
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponEnemyRocketLauncher = WeaponBase.extend({
    size: { x: 13, y: 14 },
    offset: { x: 0, y: 5 },
    animSheet: new ig.AnimationSheet( 'media/rocket.png', 24, 24 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 300, y: 0 },

    rotationTimer: null,

    damage: 50,

    speed: 500,

    init: function(x, y, settings) {
      this.parent( x + (settings.flip ? -13 : 0), y - 7, settings);

      this.addAnim( 'idle', 0.2, [0, 1, 2] );

      this.rotationTimer = new ig.Timer(0.1);

      var angleToPlayer = this.angleTo( ig.game.player );

      this.vel.x = Math.cos(angleToPlayer) * this.speed;
      this.vel.y = Math.sin(angleToPlayer) * this.speed;

      this.maxVel.x = this.vel.x;
      this.maxVel.y = this.vel.y;

      this.currentAnim.angle = angleToPlayer;
      
      if( !this.flip )
        this.offset.x = 10;
    },

    update: function() {
      this.parent();

      if( !this.flip ) {
        this.currentAnim.flip.x = !this.flip;
      }

      var angle = this.currentAnim.angle;
      var angleToPlayer = this.angleTo( ig.game.player );

      if( this.currentAnim.angle !== angleToPlayer) {
        if( this.rotationTimer.delta() >= 0 ) {
          var angleDelta = Math.atan2(Math.sin(angleToPlayer - angle), Math.cos(angleToPlayer - angle));

          var difference = (10).toRad();
          var adjustment = (10).toRad();

          if( angleDelta > difference )
            this.currentAnim.angle += adjustment;

          if( angleDelta < -difference )
            this.currentAnim.angle -= adjustment;

          this.vel.x = Math.cos(this.currentAnim.angle) * this.speed;
          this.vel.y = Math.sin(this.currentAnim.angle) * this.speed;

          this.maxVel.x = this.vel.x;
          this.maxVel.y = this.vel.y;

          this.rotationTimer.reset();
        }
      }
    },

    kill: function () {
      ig.game.spawnEntity( EntityInstantEarthquake, this.pos.x, this.pos.y, { duration: 1, strength: 10 });

      var x = this.flip ? this.pos.x : this.pos.x + this.size.x;

      ig.game.spawnEntity( EntityExplosion, x, this.pos.y );

      this.parent();
    }
  });

  EntityExplosion = ig.Entity.extend({
    size: { x: 24, y: 24 },
    offset: { x: 12, y: 12 },
    animSheet: new ig.AnimationSheet( 'media/rocket-explosion.png', 24, 24 ),

    gravityFactor: 0,

    rotationTimer: null,

    init: function(x, y, settings) {
      this.parent(x, y + 12, settings);

      this.addAnim( 'idle', 0.1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] );

      this.rotationTimer = new ig.Timer(0.1);
    },

    update: function() {
      if( this.rotationTimer.delta() >= 0 ) {
        this.currentAnim.angle += 10;
        this.rotationTimer.reset();
      }

      if( this.currentAnim.frame === 10 ) {
        this.kill();
      }

      this.parent();
    }
  });
});
