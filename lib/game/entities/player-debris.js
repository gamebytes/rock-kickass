ig.module('game.entities.player-debris')
.requires(
  'impact.entity',
  'game.entities.particle'
  )
.defines(function() {
  EntityPlayerDebris = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 170, 66, 0.7)',
    size: {
      x: 8,
      y: 8
    },
    duration: 0.25,
    count: 2,
    durationTimer: null,
    nextEmit: null,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      this.durationTimer = new ig.Timer();
      this.nextEmit = new ig.Timer();

      this.durationTimer.set(this.duration);
      this.nextEmit.set(0);
    },
    update: function() {
      if(this.durationTimer.delta() < 0 && this.nextEmit.delta() >= 0) {
        this.nextEmit.set(this.duration / this.count);
        var x = Math.random().map(0, 1, this.pos.x, this.pos.x + this.size.x);
        var y = Math.random().map(0, 1, this.pos.y, this.pos.y + this.size.y);
        ig.game.spawnEntity(EntityPlayerDebrisParticle, x, y);
      }
    }
  });
  EntityPlayerDebrisParticle = EntityParticle.extend({
    lifetime: 4,
    fadetime: 1,
    bounciness: 0.6,
    vel: {
      x: 80,
      y: 150
    },
    animSheet: new ig.AnimationSheet('media/debris.png', 8, 8),
    init: function(x, y, settings) {
      this.addAnim('idle', 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
      this.parent(x, y, settings);
    }
  });
});
