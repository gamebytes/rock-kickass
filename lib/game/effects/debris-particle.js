ig.module('game.effects.debris-particle')
.requires(
  'impact.entity',
  'game.effects.particle'
)
.defines(function(){
  EffectDebrisParticle = EffectParticle.extend({
    lifetime: 4,
    fadetime: 1,
    bounciness: 0.3,
    vel: {
      x: 60,
      y: 0
    },
    maxVel: {
      x: 1000,
      y: 1000
    },
    animSheet: new ig.AnimationSheet('media/debris.png', 8, 8),
    init: function(x, y, settings) {
      this.addAnim('idle', 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
      this.parent(x, y, settings);
    }
  });
});
