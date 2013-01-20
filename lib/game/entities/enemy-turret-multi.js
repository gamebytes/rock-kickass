ig.module(
  'game.entities.enemy-turret-multi'
)
.requires(
  'impact.entity',
  'game.weapons.enemy-pea',
  'game.entities.enemy-turret',
  'game.weapons.shotgun'
)
.defines( function() {
  EntityEnemyTurretMulti = EntityEnemyTurret.extend({
    maxHealth: 20,
    health: 20,
    shotDelay: 2,
    midShotDelay: 0.1,
    midShotMaxCount: 3,
    midShotCount: 0,

    scoreValue: 5000,

    possiblePoints: [20],

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.rewardWeapon = new WeaponShotgun();
    },

    attack: function() {
      if( this.mainShotTimer.delta() > this.shotDelay ) {
        if( this.midShotTimer.delta() > this.midShotDelay ) {
          if( Math.abs(ig.game.player.pos.y - this.pos.y) < 100 ) {
            this.midShotTimer.reset();

            this.midShotCount++;

            var position = {
              x: this.pos.x + ( this.flip ? -16 : this.gunOffset.x ),
              y: this.pos.y + ( this.gunOffset.y )
            }

            ig.game.spawnEntity( 'WeaponEnemyPea', position.x, position.y, { flip: this.flip });
            ig.game.spawnEntity( 'WeaponEnemyPea', position.x, position.y, { flip: this.flip, vel: { x: 300, y: -100 } });
            ig.game.spawnEntity( 'WeaponEnemyPea', position.x, position.y, { flip: this.flip, vel: { x: 300, y: 100 } });
            this.shootSFX.play();

            if(this.midShotCount >= this.midShotMaxCount) {
              this.mainShotTimer.reset();
              this.midShotCount = 0;
            }
          }
        }
      }
    }
  });
})
