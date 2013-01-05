ig.module('game.entities.enemy-base')
.requires(
  'impact.entity',
  'game.entities.health-bar',
  'game.effects.merge',
  'game.effects.weapon-xp',
  'game.effects.damage-debris',
  'game.entities.base'
)
.defines(function() {
  // all entities inherit from this base class
  EntityEnemyBase = EntityBase.extend({
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,

    init: function( x, y, settings ) {
      this.parent(x,y,settings);
    },

    update: function() {
      this.parent();
      this.attack();
    },

    playerPosition: function() {
      return ig.game.player.pos;
    },

    playerNearby: function(x,y) {
      var playerPos = ig.game.player.pos;
      x = x || 250;
      return playerPos.x > (this.pos.x - 250) && playerPos.x < (this.pos.x + 250);
    },

    check: function(other) {
      // when RK comes into contact with
      // a bad guy RK should die immediately
      other.receiveDamage(1000, this);
    },

    kill: function() {
      this.parent();
    },

    attack: function() {
      this.shootSFX.play();
      // placeholder, inheriting classes
      // should define this as their main
      // attack action
    }
  });
});
