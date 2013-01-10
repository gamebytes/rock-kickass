ig.module(
  'game.directors.hud'
)
.defines(function () {
  ig.Hud = ig.Class.extend({
    draw: function() {
      var game = ig.game;
      var system = ig.system;
      var playerController = ig.game.playerController;
      var player = ig.game.player;
      var font = ig.game.font;

      // Draw HUD
      font.draw( 'Score ' + playerController.score, 10, 10, 'left', '#000000' );

      font.draw( 'Health ' + ((player.health > 0) ? player.health : 0), 10, 30, 'left', '#000000' );

      var lives = playerController.lives;
      var x = system.width - 5;
      var y = 5;

      for(var i = 0; i < lives; i++) {
        x -= game.oneup.width;

        game.oneup.draw(x, y);
      }

      var weaponDisplayName = playerController.getCurrentWeapon().displayName;

      font.draw( weaponDisplayName, system.width - 10 - font.widthForString(weaponDisplayName), 40, 'left', '#000000' );
    }
  });
});