ig.module(
  'game.entities.enemy-boss-basher'
)
.requires(
  'impact.entity',
  'game.entities.enemy-base'
)
.defines( function() {
  EntityEnemyBossBasher = EntityEnemyBase.extend({
    animSheet: new ig.AnimationSheet( 'media/basher.png', 64, 64 ),
    size: { x: 64, y: 64 },
    offset: { x: 0, y: 0 },
    maxVel: { x: 500, y: 0 },
    name: 'Basher',
    hestationTime: 2,
    hesitationTimer: new ig.Timer(),
    flip: false,
    friction: { x: 50, y: 0 },
    speed: 300,
    maxHealth: 600,
    health: 600,
    enabled: true,
    scoreValue: 100000,
    debrisConfig: {
      enabled: true,
      animSheet: new ig.AnimationSheet('media/debris.png', 8, 8)
    },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'idle', 0.5, [0,1] );
      this.addAnim( 'charge', 0.1, [2,3], true);
    },
    setIdle: function() {
      this.hesitationTimer.set( this.hestationTime ); // set the rest timer
      this.currentAnim = this.anims.idle; // set the animation to idle
    },
    update: function() {
      if(this.enabled) {
        if( this.hesitationTimer.delta() > 0 ) {
          // animate the boss, making him charge at RK
          var xdir = this.flip ? -1 : 1;
          this.vel.x = this.speed * xdir;
          this.currentAnim = this.anims.charge;
        }

        this.currentAnim.flip.x = this.flip;
      }

      this.parent();
    },

    attack: function() {
      return; // basher doesn't have a traditional attack
    },

    kill: function() {
      this.parent();

      ig.game.spawnEntity( EffectDeathExplosion, this.pos.x, this.pos.y, { colorOffset: 1, callback: function() {
        ig.game.spawnEntity( EntityCutsceneBasherDeath, this.pos.x, this.pos.y, { colorOffset: 1, autoStart: true });
      } });
    },

    receiveDamage: function(amount, from) {
      if( this.enabled && this.hesitationTimer.delta() < 0 ) {
        // basher can only be damaged when he is not charging
        this.parent(amount, from);
      }
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x ) {
        this.flip = !this.flip;
        this.setIdle();
      }
    }
  });
})
