ig.module('game.entities.debris')
.requires(
  'impact.entity',
  'game.entities.particle'
  )
.defines(function() {
  EntityDebris = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',
    size: {
      x: 8,
      y: 8
    },
    duration: 4,
    count: 30,
    durationTimer: null,
    nextEmit: null,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.durationTimer = new ig.Timer();
      this.nextEmit = new ig.Timer();
    },
    triggeredBy: function(entity, trigger) {
      this.durationTimer.set(this.duration);
      this.nextEmit.set(0);
    },
    update: function() {
      if(this.durationTimer.delta() < 0 && this.nextEmit.delta() >= 0) {
        this.nextEmit.set(this.duration / this.count);
        var x = Math.random().map(0, 1, this.pos.x, this.pos.x + this.size.x);
        var y = Math.random().map(0, 1, this.pos.y, this.pos.y + this.size.y);
        ig.game.spawnEntity(EntityDebrisParticle, x, y);
      }
    }
  });
  EntityDebrisParticle = EntityParticle.extend({
    lifetime: 4,
    fadetime: 1,
    bounciness: 0.6,
    vel: {
      x: 60,
      y: 0
    },
    animSheet: new ig.AnimationSheet('media/debris.png', 8, 8),
    init: function(x, y, settings) {
      this.addAnim('idle', 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
      this.parent(x, y, settings);
    }
  });
});
