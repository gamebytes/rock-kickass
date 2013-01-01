ig.module('game.entities.base')
.requires(
  'impact.entity',
  'game.entity.health-bar',
  'game.effects.merge',
  'game.effects.weapon-xp',
  'game.effects.damage-debris'
)
.defines(function() {
  // all entities inherit from this base class
  EntityBase = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',

    init: function( x, y, settings ) {
      this.parent(x,y,settings);

      // if we're an enemy, show a healthbar above us!
      if(this.health && this.type === ig.Entity.TYPE.B && !ig.global.wm) {
        ig.game.spawnEntity(EntityHealthBar, this.pos.x, this.pos.y, { entity: this });
      }
    },

    receiveDamage: function( amount, from ) {
      this.parent(amount, from);

      // if the entity has specified a debris config,
      // we should spawn some debris whenever we are "hit"
      if( this.debrisConfig && this.debrisConfig.enabled )
      ig.game.spawnEntity( EffectDamageDebris, this.pos.x, this.pos.y, this.debrisConfigs);

      if(this.health > 0 && this.type === ig.Entity.TYPE.B /* enemies only! */) {
        this.hitSFX.play();
        ig.game.spawnEntity( EffectDeathExplosion, this.pos.x, this.pos.y, {
          particles: value,
          colorOffset: 1
        });
      }
    },

    kill: function() {
      this.parent();
      // if there is a death sound effect, play it
      if( this.deathSFX )
        this.deathSFX.play();

      if( this.scoreValue )
        ig.game.playerController.score += this.scoreValue;

      if(this.possiblePoints && this.rewardWeapon) {
        // calculate the experience points and award them to the player

        var weaponXp = this.possiblePoints.random();

        ig.game.playerController.addWeaponXp(this.rewardWeapon, weaponXp);

        ig.game.spawnEntity( EffectWeaponXp, this.pos.x, this.pos.y, { xp: weaponXp });

        ig.game.spawnEntity( EffectMerge, this.pos.x, this.pos.y, { colorOffset: 1, particles: weaponXp });
      }
    }
  });
});
