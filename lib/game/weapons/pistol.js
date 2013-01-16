ig.module( 'game.weapons.pistol' )
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponPistol = ig.Class.extend({
    name: "WeaponPistol",
    displayName: 'Pistol',
    playerAnimOffset: 0,
    hudImage: new ig.Image( 'media/hud-bullet.png' ),
    shootSFX: new ig.Sound('media/sounds/pistol_shoot.*'),

    fire: function() {
      var player = ig.game.player;
      var pos = player.getProjectileStartPosition();

      ig.game.spawnEntity( EntityPistolParticle, pos.x, pos.y, { flip: player.flip });
      this.shootSFX.play();
    }
  });

  EntityPistolParticle = WeaponBase.extend({
    size: { x: 5, y: 3 },
    animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 500, y: 0 },

    damage: 3,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim( 'idle', 1, [0] );
    },
  });
});
