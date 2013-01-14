ig.module( 'game.weapons.pistol' )
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponPistol = WeaponBase.extend({
    inventoryData: {
      name: "WeaponPistol",
      displayName: 'Pistol',
      playerAnimOffset: 0,
      hudImage: new ig.Image( 'media/hud-bullet.png' ),
      shootSFX: new ig.Sound('media/sounds/pistol_shoot.*'),
    },

    size: { x: 5, y: 3 },
    offset: { x: 0, y: 0 },
    animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 500, y: 0 },

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim( 'idle', 1, [0] );
    },
  });
});
