ig.module(
  'game.entities.enemy-launcher'
)
.requires(
  'impact.entity',
  'game.effects.death-explosion',
  'game.weapons.enemy-grenade',
  'game.weapons.grenade'
)
.defines( function() {
  EntityEnemyLauncher = ig.Entity.extend({
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/grenade-mine-sprite.png', 32, 32 ),
    size: { x: 32, y: 32 },
    offset: { x: 0, y: 0 },
    gunOffset: { x: 6, y: -1 },
    flip: false,
    maxHealth: 20,
    health: 20,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    mainShotTimer: null,
    preShotTimer: null,
    shotDelay: 4,
    preShotDelay: 3,
    postShotDelay:5,

    scoreValue: 2000,

    possiblePoints: [20],
    rewardWeapon: null,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 0.5, [2], true);
      this.addAnim( 'preparing', 1, [1], true);
      this.addAnim( 'firing', 1, [0], true);

      this.rewardWeapon = new WeaponGrenade(0, 0, {}).getForInventory();

      this.mainShotTimer = new ig.Timer();

      if( !ig.global.wm ) {
        ig.game.spawnEntity(EntityHealthBar, this.pos.x, this.pos.y, { entity: this });
      }
    },

    playerNear: function(px) {
      return (ig.game.player.pos.x > (this.pos.x - px)) &&
                        (ig.game.player.pos.x < (this.pos.x + px));
    },

    update: function() {
      this.parent();

      shouldFire = this.playerNear(200);

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
    },

    kill: function() {
      this.parent();

      ig.game.playerController.score += this.scoreValue;

      var weaponXp = this.possiblePoints.random();

      ig.game.playerController.addWeaponXp(this.rewardWeapon, weaponXp);

      this.deathSFX.play();

      ig.game.spawnEntity( EffectWeaponXp, this.pos.x, this.pos.y, { xp: weaponXp });

      ig.game.spawnEntity( EffectMerge, this.pos.x, this.pos.y, { colorOffset: 1, particles: weaponXp });
    },

    receiveDamage: function(value) {
      this.parent(value);

      if(this.health > 0) {
        this.hitSFX.play();
        ig.game.spawnEntity( EffectDeathExplosion, this.pos.x, this.pos.y, {
          particles: value,
          colorOffset: 1
        });
      }
    }
  });
})
