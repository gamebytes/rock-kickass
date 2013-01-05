ig.module(
  'game.entities.enemy-turret'
)
.requires(
  'impact.entity',
  'game.effects.death-explosion',
  'game.weapons.enemy-pea',
  'game.entities.enemy-base',
  'game.weapons.pea'
)
.defines( function() {
  EntityEnemyTurret = EntityEnemyBase.extend({
    animSheet: new ig.AnimationSheet( 'media/turret.png', 64, 64 ),
    size: { x: 12, y: 44 },
    offset: { x: 28, y: 20 },
    gunOffset: { x: 12, y: 5 },
    flip: false,
    maxHealth: 20,
    health: 20,
    mainShotTimer: null,
    midShotTimer: null,
    shotDelay: 2,
    midShotDelay: 0.1,
    midShotMaxCount: 3,
    midShotCount: 0,
    scoreValue: 1000,
    weaponName: 'WeaponEnemyPea',
    possiblePoints: [20],
    rewardWeapon: null,
    debrisConfig: {
      enabled: true,
      animSheet: new ig.AnimationSheet('media/debris.png', 8, 8)
    },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 1, [0]);

      this.mainShotTimer = new ig.Timer();
      this.midShotTimer = new ig.Timer();

      this.rewardWeapon = new WeaponPea(0, 0, {}).getForInventory();
    },

    update: function() {
      this.parent();

      this.flip = ig.game.player.pos.x < this.pos.x;

      this.currentAnim.flip.x = this.flip;
    },

    attack: function() {
      if( this.mainShotTimer.delta() > this.shotDelay ) {
        if( this.midShotTimer.delta() > this.midShotDelay ) {
          this.midShotTimer.reset();

          this.midShotCount++;

          var position = {
            x: this.pos.x + ( this.flip ? -12 : this.gunOffset.x ),
            y: this.pos.y + ( this.gunOffset.y )
          }

          ig.game.spawnEntity( this.weaponName, position.x, position.y, { flip: this.flip });
          this.shootSFX.play();

          if(this.midShotCount >= this.midShotMaxCount) {
            this.mainShotTimer.reset();
            this.midShotCount = 0;
          }
        }
      }
    }
  });
})
