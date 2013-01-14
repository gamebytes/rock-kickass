ig.module('game.weapons.rocket-launcher')
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponRocketLauncher = WeaponBase.extend({
    inventoryData: {
      name: "WeaponRocketLauncher",
      displayName: 'Rocket Launcher',
      playerAnimOffset: 0,
      hudImage: new ig.Image( 'media/hud-bullet.png' ),
      shootSFX: new ig.Sound('media/sounds/pistol_shoot.*'),
    },
    
    size: { x: 24, y: 24 },
    offset: { x: 0, y: 12 },
    animSheet: new ig.AnimationSheet( 'media/rocket.png', 24, 24 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 300, y: 0 },

    damage: 50,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim( 'idle', 0.2, [0, 1, 2] );
    },

    update: function() {
      this.parent();

      this.currentAnim.flip.x = !this.flip;
    }
  });
});
