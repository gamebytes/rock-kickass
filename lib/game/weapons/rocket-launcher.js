ig.module('game.weapons.rocket-launcher')
.requires(
  'impact.entity',
  'game.weapons.weapon-base'
)
.defines(function() {
  WeaponRocketLauncher = ig.Class.extend({
    name: "WeaponRocketLauncher",
    displayName: 'Rockets',
    playerAnimOffset: 0,
    hudImage: new ig.Image( 'media/hud-bullet.png' ),
    shootSFX: new ig.Sound('media/sounds/pistol_shoot.*'),
    
    fire: function() {
      var player = ig.game.player;
      var pos = player.getProjectileStartPosition();

      ig.game.spawnEntity( EntityRocketLauncherParticle, pos.x, pos.y, { flip: player.flip });
      this.shootSFX.play();
    }
  });

  EntityRocketLauncherParticle = WeaponBase.extend({
    size: { x: 13, y: 14 },
    offset: { x: 0, y: 5 },
    animSheet: new ig.AnimationSheet( 'media/rocket.png', 24, 24 ),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    maxVel: { x: 300, y: 0 },

    damage: 50,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim( 'idle', 0.2, [0, 1, 2] );
      
      if( !this.flip )
        this.offset.x = 10;
    },

    update: function() {
      this.parent();

      this.currentAnim.flip.x = !this.flip;
    },

    kill: function () {
      ig.game.spawnEntity( EntityInstantEarthquake, this.pos.x, this.pos.y, { duration: 1, strength: 10 });

      this.parent();
    }
  });
});
