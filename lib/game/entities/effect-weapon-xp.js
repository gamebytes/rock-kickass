ig.module(
  'game.entities.effect-weapon-xp'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityEffectWeaponXp = ig.Entity.extend({
    lifetimeTimer: null,
    lifetime: 1,

    friction: {x: 0, y: 0},
    maxVel: { x: 0, y: -30 },
    vel: { x: 0, y: -30 },

    xp: 0,

    init: function ( x, y, settings ) {
      this.parent( x, y, settings);

      this.xp = settings.xp;
      this.lifetimeTimer = new ig.Timer();
    },

    update: function() {
      this.parent();
      
      if( this.lifetimeTimer.delta() > this.lifetime ) {
        this.kill();
      }
    },

    draw: function () {
      var x = ig.game.camera.calculatePosition('x', this.pos.x);
      var y = ig.game.camera.calculatePosition('y', this.pos.y) - ig.game.font.heightForString( 'a' );

      ig.system.context.globalAlpha = this.lifetimeTimer.delta().map(0, this.lifetime, 1, 0);;
      ig.game.font14.draw( this.xp + '% xp', x, y, ig.Font.ALIGN.CENTER );
      ig.system.context.globalAlpha = 1;
    }
  });
});
