ig.module(
  'game.entities.enemy-rocket-turret'
)
.requires(
  'impact.entity',
  'game.effects.death-explosion',
  'game.weapons.enemy-grenade',
  'game.entities.enemy-base',
  'game.weapons.rocket-launcher'
)
.defines( function() {
  EntityEnemyRocketTurret = EntityEnemyBase.extend({
    animSheet: new ig.AnimationSheet( 'media/rocket-launcher-top-mount.png', 64, 64 ),
    size: { x: 32, y: 32 },
    offset: { x: 16, y: 0 },
    gunOffset: { x: 12, y: 5 },
    flip: false,
    maxHealth: 20,
    health: 20,

    gravityFactor: 0,

    shotTimer: null,
    midShotTimer: null,
    shotDelay: 2,
    midShotDelay: 0.1,
    midShotMaxCount: 3,
    midShotCount: 0,
    scoreValue: 1000,
    weaponName: 'WeaponEnemyGrenade', //'WeaponEnemyRocketLauncher',
    possiblePoints: [20],
    rewardWeapon: null,
    debrisConfig: {
      enabled: true,
      animSheet: new ig.AnimationSheet('media/debris.png', 8, 8)
    },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 1, [0]);
      this.addAnim( 'firing', 2, [1,2,3,4,5,6,7,8,9]);

      this.shotTimer = new ig.Timer();

      this.rewardWeapon = new WeaponRocketLauncher();
    },

    update: function() {
      this.parent();

      this.flip = ig.game.player.pos.x < this.pos.x;

      this.currentAnim.flip.x = !this.flip;
    },

    attack: function() {
      if( this.shotTimer.delta() > this.shotDelay ) {
        // if( Math.abs(ig.game.player.pos.y - this.pos.y) < 100 ) {
        var position = {
          x: this.pos.x + ( this.flip ? -12 : this.gunOffset.x ),
          y: this.pos.y + ( this.gunOffset.y )
        }

        ig.game.spawnEntity( this.weaponName, position.x, position.y, { flip: this.flip });
        this.shootSFX.play();

        this.shotTimer.reset();
      }
    }
  });
})
