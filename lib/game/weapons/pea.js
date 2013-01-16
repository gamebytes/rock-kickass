ig.module( 'game.weapons.pea' )
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponPea = ig.Class.extend({
    name: 'WeaponPea',
    displayName: 'Cannon',
    playerAnimOffset: 0,
    hudImage: new ig.Image( 'media/hud-pea.png' ),
    shootSFX: new ig.Sound('media/sounds/shoot.*'),

    fire: function() {
      var player = ig.game.player;
      var pos = player.getProjectileStartPosition();

      ig.game.spawnEntity( EntityPeaParticle, pos.x, pos.y, { flip: player.flip });
      this.shootSFX.play();
    }
  });

  EntityPeaParticle = WeaponBase.extend({
    size: { x: 6, y: 5 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/pea.png', 6, 5 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 500, y: 0 },
    
    damage: 5,

    init: function( x, y, settings ) {
      this.addAnim( 'idle', 0.2, [0], true);
      this.addAnim( 'hit', 0.03, [1,2,3,4], true);

      this.parent( x, y, settings);
    },

    update: function() {
      this.parent();

      this.currentAnim.flip.x = !this.flip;
      
      if( this.currentAnim === this.anims.hit && this.currentAnim.loopCount > 0 ) {
        this.kill();
      }
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
      if( res.collision.x || res.collision.y || res.collision.slope ) {
        this.vel.x  = 0;
        this.currentAnim = this.anims.hit.rewind();
      }
    },

    check: function(other) {
      if( this.currentAnim !== this.anims.hit ) {
        other.receiveDamage(this.damage, this);
        this.kill();
      }
    },

    collideWith: function( other, axis ) {
      if( this.currentAnim !== this.anims.hit && other ) {
        this.kill();
      }
    }
  });
});
