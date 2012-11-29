ig.module(
  'game.entities.effect-merge'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityEffectMerge = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    lifetime: 5,
    callback: null,
    particles: 100,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      if( settings.particles ) {
        this.particles = settings.particles;
      }

      for( var i = 0; i < this.particles; i++ ) {
        if(ig.game.spawnEntity) {
          ig.game.spawnEntity(EntityEffectMergeParticle, x, y, { colorOffset: settings.colorOffset ? settings.colorOffset : 0 });
          this.idleTimer = new ig.Timer();
        }
      }

      this.callback = settings.callback;
      
    },

    update: function() {
      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        if(this.callback)
          this.callback();
        return;
      }
    }
  });

  EntityEffectMergeParticle = ig.Entity.extend({
    size: {x: 4, y: 4},
    lifetime: 3,
    collides: ig.Entity.COLLIDES.NEVER,
    colorOffset: 0,
    totalColors: 7,
    animSheet: new ig.AnimationSheet( 'media/blood.png', 4, 4 ),
    friction: {x: 0, y: 0},

    turnAroundTimer: null,
    turnAroundTime: 1.5,
    turnedAround: false,

    baseSpeed: 200,
    speed: 0,

    previousDistanceToPlayer: 0,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      
      var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
      this.addAnim( 'idle', 0.2, [frameID] );

      var angle = Math.random() * 360;
      this.speed = Math.random() * this.baseSpeed;

      this.vel.x = Math.cos(angle) * this.speed;
      this.vel.y = Math.sin(angle) * this.speed;

      this.maxVel.x = this.vel.x;
      this.maxVel.y = this.vel.y;

      this.idleTimer = new ig.Timer();
      this.turnAroundTimer = new ig.Timer();
    },

    update: function() {
      if( this.turnedAround ) {
        this.maxVel.x = this.vel.x *= 1.1;
        this.maxVel.y = this.vel.y *= 1.1;
      }

      if( !this.turnedAround && this.turnAroundTimer.delta() > this.turnAroundTime ) {
        var player = ig.game.player;
        var angle = this.angleTo( player );

        this.vel.x = Math.cos(angle) * this.speed;
        this.vel.y = Math.sin(angle) * this.speed;

        this.maxVel.x = this.vel.x;
        this.maxVel.y = this.vel.y;

        this.turnAroundTimer = null;

        this.turnedAround = true;

        this.previousDistanceToPlayer = this.distanceTo( player );
      }

      if( this.idleTimer.delta() > this.lifetime ) {
        this.kill();
        return;
      }

      this.parent();
    },

    draw: function() {
      if( this.turnedAround ) {
        var player = ig.game.player;
        
        var distanceToPlayer = this.distanceTo( player );

        if( distanceToPlayer > this.previousDistanceToPlayer) {
          // We passed the player
          this.kill();
          return;
        } else {
          this.previousDistanceToPlayer = distanceToPlayer;
        }
      }
      
      this.parent();
    },

    handleMovementTrace: function( res ) {
      // This completely ignores the trace result (res) and always
      // moves the entity according to its velocity
      this.pos.x += this.vel.x * ig.system.tick;
      this.pos.y += this.vel.y * ig.system.tick;
    }
  });
});
