ig.module(
  'game.entities.enemy-launcher'
)
.requires(
  'impact.entity',
  'game.effects.death-explosion',
  'game.weapons.enemy-grenade',
  'game.weapons.grenade',
  'game.entities.enemy-base'
)
.defines( function() {
  EntityEnemyLauncher = EntityEnemyBase.extend({
    animSheet: new ig.AnimationSheet( 'media/grenade-mine-sprite.png', 32, 32 ),
    size: { x: 32, y: 32 },
    offset: { x: 0, y: 0 },
    gunOffset: { x: 6, y: -1 },
    flip: false,
    maxHealth: 20,
    health: 20,
    mainShotTimer: null,
    preShotTimer: null,
    shotDelay: 4,
    preShotDelay: 3,
    postShotDelay:5,
    scoreValue: 2000,
    possiblePoints: [20],
    rewardWeapon: null,
    debrisConfig: {
      enabled: true,
      animSheet: new ig.AnimationSheet('media/debris.png', 8, 8)
    },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 0.5, [2], true);
      this.addAnim( 'preparing', 1, [1], true);
      this.addAnim( 'firing', 1, [0], true);

      this.rewardWeapon = new WeaponGrenade();

      this.mainShotTimer = new ig.Timer();
    },

    attack: function() {
      shouldFire = this.playerNearby(200);

      if( shouldFire ) {
        if( this.mainShotTimer.delta() > -4 && this.mainShotTimer.delta() < 0 ) {
          this.currentAnim = this.anims.idle;
          if( this.mainShotTimer.delta() > -2 ) {
            this.currentAnim = this.anims.preparing;
          }
        }
        if( this.mainShotTimer.delta() > 0 ) {
          this.currentAnim = this.anims.firing;
          ig.game.spawnEntity( 'WeaponEnemyGrenade',
                                this.pos.x + this.gunOffset.x,
                                this.pos.y + this.gunOffset.y,
                                { flip: ig.game.player.pos.x < this.pos.x });
          this.shootSFX.play();
          this.mainShotTimer.set(4);
        }
      }
    }
  });
})
