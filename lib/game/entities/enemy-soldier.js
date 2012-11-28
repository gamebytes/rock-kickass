ig.module(
  'game.entities.enemy-soldier'
)
.requires(
  'impact.entity',
  'game.entities.effect-death-explosion'
)
.defines( function() {
  EntityEnemySoldier = ig.Entity.extend({
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/soldier.png', 64, 64 ),
    originalOffset: { x: 16, y: 29 },
    flipOffset: { x: 20, y: 29 },
    size: { x: 20, y: 35 },
    offset: { x: 16, y: 29 },
    gunOffset: { x: 30, y: 1 },
    flip: false,
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    maxVel: { x: 200, y: 450 },
    friction: { x: 2000, y: 0 },
    accelGround: 500,
    health: 10,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.addAnim( 'walk', .07, [0]);
    },

    update: function() {
      var isNearWall = !ig.game.collisionMap.getTile(
          this.pos.x + (this.flip ? +4 : this.size.x - 4),
          this.pos.y + this.size.y+1
        );
      if( isNearWall ) {
        this.flip = !this.flip;
      }
      var xdir = this.flip ? -1 : 1;
      this.vel.x = this.speed * xdir;
      this.currentAnim.flip.x = this.flip;
      this.parent();
    },

    kill: function() {
      this.parent();
      this.deathSFX.play();
      ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, { colorOffset: 1 });
    },

    receiveDamage: function(value) {
      this.parent(value);
      if(this.health > 0) {
        this.hitSFX.play();
        ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, {
          particles: value,
          colorOffset: 1
        });
      }
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x ) {
        this.flip = !this.flip;
      }
    },

    check: function( other ) {
      other.receiveDamage( 10, this );
    }
  });
})
