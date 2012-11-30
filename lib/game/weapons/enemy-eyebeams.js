ig.module(
  'game.weapons.enemy-eyebeams'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponEnemyEyebeams = ig.Entity.extend({
    getForInventory: function() {
      return {
        name: 'WeaponEnemyEyebeams'
      };
    },
    size: { x: 20, y: 10 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/eyebeams.png', 20, 10 ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    maxVel: { x: 400, y: 0 },
    friction: {x: 0, y: 0},

    init: function( x, y, settings ) {
      this.parent( x + (settings.flip ? -4 : 7), y + 4, settings);

      if( settings.vel ) {
        this.vel.y = settings.vel.y;
        this.maxVel.y = settings.vel.y;
      }

      this.flip = settings.flip;

      this.vel.x = 0;

      this.addAnim( 'idle', 0.01, [4], true);
      this.addAnim( 'fire', 0.1, [0,1,2,3], true);

      this.currentAnim = this.anims.fire;
    },

    update: function() {
      if( this.currentAnim === this.anims.fire && this.currentAnim.frame === 3 ) {
        this.currentAnim = this.anims.idle;
      }

      if(this.currentAnim === this.anims.idle) {
        this.vel.x = (this.flip ? -this.maxVel.x : this.maxVel.x);
      }

      this.currentAnim.flip.x = this.flip;

      this.parent();
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x || res.collision.y || res.collision.slope ) {
        this.kill();
      }
    },

    check: function(other) {
      other.receiveDamage(50, this);
      this.kill();
    },

    collideWith: function( other, axis ) {
      if( other ) {
        this.kill();
      }
    }
  });
});
