ig.module(
  'game.weapons.beam'
)
.requires(
  'impact.entity'
)
.defines(function() {
  WeaponBeam = ig.Class.extend({
    name: 'WeaponBeam',
    displayName: 'Laser Beam',
    playerAnimOffset: 0,
    hudImage: new ig.Image( 'media/hud-bullet.png' ),
    shootSFX: new ig.Sound('media/sounds/eyebeams.*'),
    
    fire: function() {
      var player = ig.game.player;
      var pos = player.getProjectileStartPosition();

      ig.game.spawnEntity( EntityBeamParticle, pos.x, pos.y, { flip: player.flip });
      this.shootSFX.play();
    }
  });

  EntityBeamParticle = WeaponBase.extend({
    size: { x: 20, y: 4 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/laser-beam.png', 20, 4 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,
    
    maxVel: { x: 500, y: 0 },
    friction: {x: 0, y: 0},
    damage: 15,

    init: function( x, y, settings ) {
      this.parent( x + (settings.flip ? -20 : 7), y + 6, settings);
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
