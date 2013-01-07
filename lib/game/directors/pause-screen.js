ig.module(
  'game.directors.pause-screen'
)
.defines(function () {
  ig.PauseScreen = ig.Class.extend({
    selectedIndex: 0,

    menu: null,

    init: function(menu) {
        this.menu = menu;
    },

    update: function() {
      if (ig.input.pressed('enter')) {
        this.menu[this.selectedIndex].action();
      }

      if (ig.input.pressed('down')) {
        this.selectedIndex++;

        if (this.selectedIndex >= this.menu.length) {
          this.selectedIndex = 0;
        }
      }

      if (ig.input.pressed('up')) {
        this.selectedIndex--;

        if (this.selectedIndex < 0) {
          this.selectedIndex = this.menu.length - 1;
        }
      }
    },

    draw: function() {
      var game = ig.game;
      var playerController = ig.game.playerController;

      game.pauseBackground.draw(10, 10, 0, 0, ig.system.width - 20, ig.system.height - 20);

      var weaponTextX = 20;
      var weaponTextY = 20;
      var weaponTextSpacing = 20;
      var weaponXpPercentX = 200;

      var context = ig.system.context;

      context.strokeStyle = '#ffffff';

      game.fontWhite.draw('Weapons:', weaponTextX, weaponTextY, ig.Font.ALIGN.LEFT);

      for (var i = 0; i < playerController.allWeapons.length; i++) {
        var xp = 0;

        for (var j = 0; j < playerController.weaponXps.length; j++) {
          if (playerController.allWeapons[i].name == playerController.weaponXps[j].name) {
            xp = playerController.weaponXps[j].xp;
            break;
          }
        };

        game.fontWhite.draw(playerController.allWeapons[i].displayName, weaponTextX + (100 / ig.system.scale) + 20, weaponTextY + ((i + 1) * weaponTextSpacing), ig.Font.ALIGN.LEFT);
        
        var drawX = ig.system.getDrawPos(weaponTextX);
        var drawY = ig.system.getDrawPos(weaponTextY + ((i + 1) * weaponTextSpacing));
        
        if (xp >= 100) {
          context.fillStyle = '#00ff00';
        } else {
          context.fillStyle = '#ffffff';
        }

        context.fillRect(drawX, drawY, (xp > 100) ? 100 : xp, 20);
        context.strokeRect(drawX, drawY, 100, 20);
      }

      var menuX = 300;
      var menuY = 20;
      var menuSpacing = 20;

      game.arrowImage.draw(menuX - 20, menuY + this.selectedIndex * menuSpacing);

      for (var i = 0; i < this.menu.length; i++) {
        game.fontWhite.draw(this.menu[i].display(), menuX, menuY + i * menuSpacing, ig.Font.ALIGN.LEFT);
      };
    }
  });
});