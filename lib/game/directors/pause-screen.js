ig.module(
  'game.director.pause-screen'
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

      if (playerController.weapons.length > 0) {
        game.fontWhite.draw('Weapons:', weaponTextX, weaponTextY, ig.Font.ALIGN.LEFT);

        for (var i = 0; i < playerController.weapons.length; i++) {
          game.fontWhite.draw(playerController.weapons[i].displayName, weaponTextX, weaponTextY + ((i + 1) * weaponTextSpacing), ig.Font.ALIGN.LEFT);
        };
      }

      game.fontWhite.draw('Weapon Progress:', weaponTextX, weaponTextY + ((2 + playerController.weapons.length) * weaponTextSpacing), ig.Font.ALIGN.LEFT);

      if (playerController.weaponXps.length > 0) {
        var validWeaponXpCount = 0;

        for (var i = 0; i < playerController.weaponXps.length; i++) {
          if (playerController.weaponXps[i].xp < 100) {
            game.fontWhite.draw(playerController.weaponXps[i].displayName, weaponTextX, weaponTextY + ((validWeaponXpCount + 3 + playerController.weapons.length) * weaponTextSpacing), ig.Font.ALIGN.LEFT);
            game.fontWhite.draw(playerController.weaponXps[i].xp + '%', weaponXpPercentX, weaponTextY + ((validWeaponXpCount + 3 + playerController.weapons.length) * weaponTextSpacing), ig.Font.ALIGN.LEFT);

            validWeaponXpCount++;
          }
        };
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