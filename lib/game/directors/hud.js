ig.module(
  'game.directors.hud'
)
.defines(function () {
  ig.Hud = ig.Class.extend({

    letterbox: false,

    init: function() {
      this.enabled = true;
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
      if( this.letterbox ) {
        var context = ig.system.context;

        var boxHeight = ig.system.getDrawPos(40);
        var width = ig.system.getDrawPos(ig.system.width);
        var height = ig.system.getDrawPos(ig.system.height);

        context.fillStyle = '#000';
        context.fillRect(0, 0, width, boxHeight);
        context.fillRect(0, height - boxHeight, width, boxHeight);
      } else {
        var playerController = ig.game.playerController,
          score = playerController.score,
          health = playerController.health,
          lives = playerController.lives,
          weapon = playerController.getCurrentWeapon();

        this.rockStatusBar.draw( 0, 0 );
        this.weaponStatusBar.draw( ig.system.width - this.weaponStatusBar.width, 0 );

        if( health > 0 ) {
          this.currentAnimation.draw( 40, 10 );
        }

        this.font.draw( 'x' + lives, 40, 25, ig.fontRenderSwitcher.align.left, '#000000' );

        weapon.hudImage.draw( ig.system.width - weapon.hudImage.width / 2 - this.weaponStatusBar.width / 2, 10 );

        this.font8.draw( weapon.displayName, ig.system.width - this.weaponStatusBar.width / 2, 34, ig.fontRenderSwitcher.align.center, '#000000' );
        // this.font.draw( 'Score ' + playerController.score, 10, 10, ig.Font.ALIGN.LEFT );
      }
    }
  });

});
