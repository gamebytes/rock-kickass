ig.module(
  'game.directors.hud'
)
.defines(function () {
  ig.Hud = ig.Class.extend({

    init: function() {
      this.rockStatusBar = new ig.Image( 'media/hud-health-bar.png' );
      this.weaponStatusBar = new ig.Image( 'media/hud-weapon-bar.png' );
      this.healthSprite = new ig.AnimationSheet( 'media/hud-health.png', 70, 14 );
      this.font = new ig.Font( 'media/04b03.16.black.font.png' );
      this.font14 = new ig.Font( 'media/manaspace.8.black.font' );

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

      this.font.draw( 'x' + lives, 40, 25, ig.Font.ALIGN.LEFT );

      var width = this.font14.widthForString( weapon.displayName )/2,
          height = this.font14.heightForString( weapon.displayName );
      weapon.hudImage.draw( ig.system.width - 47, 10 );

      this.font14.draw( weapon.displayName, ig.system.width - width - 20, 20 + height + 3, ig.Font.ALIGN.CENTER );
      // this.font.draw( 'Score ' + playerController.score, 10, 10, ig.Font.ALIGN.LEFT );
    }
  });

});
