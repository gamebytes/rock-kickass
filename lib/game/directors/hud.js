ig.module(
  'game.directors.hud'
)
.defines(function () {
  ig.Hud = ig.Class.extend({
    init: function() {
      this.rockStatusBar = new ig.Image( 'media/hud-health-bar.png' );
      this.weaponStatusBar = new ig.Image( 'media/hud-weapon-bar.png' );
      this.healthSprite = new ig.AnimationSheet( 'media/hud-health.png', 70, 14 );
      this.font = ig.game.font;
      this.font8 = ig.game.font8;

      this.healthAnimations = [];
      for(var i = 0; ++i < 10; ) {
        this.healthAnimations.push(
          new ig.Animation( this.healthSprite, 1, [i], true )
        );
      }

      this.currentAnimation = this.healthAnimations[0];
    },

    update: function() {
      var playerController = ig.game.playerController,
          health = playerController.health;

      this.currentAnimation = this.healthAnimations[ 10 - Math.round(health/10) ];
    },

    draw: function() {
      var playerController = ig.game.playerController,
          score = playerController.score,
          health = playerController.health,
          lives = playerController.lives,
          weapon = playerController.getCurrentWeapon();

      this.rockStatusBar.draw( 0, 0 );
      this.weaponStatusBar.draw( ig.system.width - 71, 0 );

      this.currentAnimation.draw( 40, 10 );

      this.font.draw( 'x' + lives, 40, 25, 'left', '#000000' );

      var width = this.font8.widthForString( weapon.displayName )/2,
          height = this.font8.heightForString( weapon.displayName );
      weapon.hudImage.draw( ig.system.width - 47, 10 );

      this.font8.draw( weapon.displayName, ig.system.width - width - 20, 20 + height + 3, 'center', '#000000' );
      // this.font.draw( 'Score ' + playerController.score, 10, 10, ig.Font.ALIGN.LEFT );
    }
  });

});
