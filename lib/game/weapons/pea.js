ig.module(
  'game.weapons.pea'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponPea = ig.Entity.extend({
    getForInventory: function() {
      return {
        name: 'WeaponPea'
      };
    },
    size: { x: 6, y: 5 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/pea.png', 6, 5 ),
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
    maxVel: { x: 500, y: 0 },
    friction: {x: 0, y: 0},

    init: function( x, y, settings ) {
      this.parent( x + (settings.flip ? -4 : 7), y + 4, settings);
      this.vel.x  = (settings.flip ? -this.maxVel.x : this.maxVel.x);
      this.addAnim( 'idle', 0.2, [0], true);
      this.addAnim( 'hit', 0.03, [1,2,3,4], true);
    },

    update: function() {
      this.parent();
      if( this.currentAnim === this.anims.hit && this.currentAnim.loopCount > 0 ) {
        this.kill();
      }
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x || res.collision.y ) {
        this.vel.x  = 0;
        this.currentAnim = this.anims.hit.rewind();
      }
    },

    check: function(other) {
      if( this.currentAnim !== this.anims.hit ) {
        other.receiveDamage(3, this);
        this.vel.x  = 0;
        this.currentAnim = this.anims.hit.rewind();
      }
    }
  });
});
