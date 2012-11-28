ig.module(
  'game.entities.enemy-turret'
)
.requires(
  'impact.entity',
  'game.entities.effect-death-explosion',
  'game.weapons.enemy-pea',
  'game.weapons.pea'
)
.defines( function() {
  EntityEnemyTurret = ig.Entity.extend({
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/turret.png', 64, 64 ),
    size: { x: 12, y: 44 },
    offset: { x: 28, y: 20 },
    gunOffset: { x: 12, y: 5 },
    flip: false,
    health: 20,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    mainShotTimer: null,
    midShotTimer: null,
    shotDelay: 2,
    midShotDelay: 0.1,
    midShotMaxCount: 3,
    midShotCount: 0,

    possiblePoints: [20],
    scoreValue: 1000,

    weaponName: 'WeaponEnemyPea',

    rewardWeapon: null,

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
    },

    kill: function() {
      this.parent();

      ig.game.playerController.score += this.scoreValue;

      var weaponXp = this.possiblePoints.random();

      ig.game.playerController.addWeaponXp(this.rewardWeapon, weaponXp);

      this.deathSFX.play();
      ig.game.spawnEntity( EntityEffectMerge, this.pos.x, this.pos.y, { colorOffset: 1, particles: weaponXp });
    },

    receiveDamage: function(value) {
      this.parent(value);

      if(this.health > 0) {
        this.hitSFX.play();
        ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, {
          particles: value,
          colorOffset: 1
        });
      }
    }
  });
})
