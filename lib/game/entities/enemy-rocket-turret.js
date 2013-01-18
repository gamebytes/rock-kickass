ig.module(
  'game.entities.enemy-rocket-turret'
)
.requires(
  'impact.entity',
  'game.effects.death-explosion',
  'game.entities.enemy-base',
  'game.weapons.rocket-launcher',
  'game.weapons.enemy-rocket-launcher'
)
.defines( function() {
  EntityEnemyRocketTurret = EntityEnemyBase.extend({
    animSheet: new ig.AnimationSheet( 'media/rocket-launcher-top-mount.png', 64, 64 ),
    size: { x: 32, y: 32 },
    offset: { x: 20, y: 0 },
    flip: false,
    maxHealth: 20,
    health: 20,

    gunOffset: { x: 24, y: 16 },
    gunFlipOffset: { x: 0, y: 0 },

    originalOffset: { x: 0, y: 0 },
    flipOffset: { x: 20, y: 0 },

    gravityFactor: 0,

    shotTimer: null,
    shotDelay: 2.4,
    scoreValue: 1000,
    weaponName: 'WeaponEnemyRocketLauncher',
    possiblePoints: [20],
    rewardWeapon: null,
    debrisConfig: {
      enabled: true,
      animSheet: new ig.AnimationSheet('media/debris.png', 8, 8)
    },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 0.5, [0, 1]);
      this.addAnim( 'firing', 0.3, [2,3,4,5,6,7,8,9]);

      this.shotTimer = new ig.Timer();

      this.rewardWeapon = new WeaponRocketLauncher();
    },

    update: function() {
      this.parent();

      this.flip = ig.game.player.pos.x < this.pos.x;

      this.offset.x = !this.flip ? this.originalOffset.x : this.flipOffset.x;

      this.currentAnim.flip.x = !this.flip;

      if( this.currentAnim == this.anims.firing ) {
        if( this.currentAnim.frame === 9 ) {
          this.currentAnim = this.anims.idle;
        }
      }
    },

    attack: function() {
      if( this.shotTimer.delta() > this.shotDelay ) {
        this.currentAnim = this.anims.firing;

        // if( Math.abs(ig.game.player.pos.y - this.pos.y) < 100 ) {
        var position = {
          x: this.pos.x + ( !this.flip ? this.gunOffset.x : this.gunFlipOffset.x ),
          y: this.pos.y + ( this.gunOffset.y )
        }

        ig.game.spawnEntity( this.weaponName, position.x, position.y, { flip: this.flip });
        this.shootSFX.play();

        this.shotTimer.reset();
      }
    }
  });
})
