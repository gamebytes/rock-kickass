ig.module(
	'game.main'
)
.requires(
  'plugins.impact-splash-loader',
	'impact.game',
	'impact.font',

  'game.director.player-controller',
  'game.director.camera',

  'game.levels.intro2',
  'game.levels.intro3',
  'game.levels.intro4',
  'game.levels.intro5',

  'game.levels.labcutscene1',
  'game.levels.labcutscene2',

  'game.levels.lab1',
  'game.levels.lab2',
  'game.levels.lab3',
  'game.levels.lab4',
  'game.levels.lab5',
  'game.levels.credits',

  'game.levels.gameover',

  'game.weapons.pea',
  'game.weapons.grenade',
  'game.weapons.shotgun',

  'game.entities.effect-weapon-xp',
  'game.entities.effect-weapon-acquired',
  'game.entities.health-bar'
)
.defines(function() {

MyGame = ig.Game.extend({

	// Load a font
  font: new ig.Font( 'media/04b03.16.black.font.png' ),
  fontWhite: new ig.Font( 'media/04b03.14.white.font.png' ),
  font14: new ig.Font( 'media/04b03.14.black.font.png' ),

  oneup: new ig.Image('media/1up.png'),
  pauseBackground: new ig.Image('media/pause-background.png'),

	gravity: 700,
  camera: null,
  currentLevel: null,
  clearColor: "#FFFFFF",

  paused: false,

	init: function() {
		var q = {};
		if(window.location.href.indexOf("?") > -1) {
			var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          q[pair[0]] = pair[1];
      }
		}

		ig.game.playerController = new ig.PlayerController();

    this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 5 );
    this.camera.trap.size.x = ig.system.width/10;
    this.camera.trap.size.y = ig.system.height/3;
    this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

		// Initialize your game here; bind keys etc.
    this.loadLevel( q.level ? ig.global[q.level] : LevelLabcutscene1 );

    if(q.weapon) {
      this.addWeapon(q.weapon);
    }

    ig.game.bindInput = this.bindInput;
    ig.game.bindInput();
	},

  bindInput: function() {
    ig.input.bind( ig.KEY._5, 'reset' );
    ig.input.bind( ig.KEY._6, 'resetLevel' );

    // General input
    ig.input.bind( ig.KEY.ESC, 'pause' );

    // player actions
    ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
    ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
    ig.input.bind( ig.KEY.X, 'jump' );
    ig.input.bind( ig.KEY.C, 'shoot' );
    ig.input.bind( ig.KEY.TAB, 'switch' );
    ig.input.bind( ig.KEY.Z, 'crouch' );
  },

  addWeapon: function( weapon ) {
    var w = ig.global[weapon];
    ig.game.playerController.addWeapon( new w(0, 0, {}).getForInventory(), -1 );
  },

  loadLevel: function( level ) {
      this.currentLevel = level;
      this.parent( level );

      this.player = this.getEntitiesByType( EntityPlayer )[0];

      // Set camera max and reposition trap
      this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
      this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

      this.camera.set( this.player );
  },

	update: function() {
    if (!this.paused) {
      if (ig.input.pressed('pause')) {
        this.paused = true;

        return;
      }

      // Update all entities and backgroundMaps
      this.camera.update();
      this.parent();

      if( ig.input.state('reset') ) {
        this.loadLevel( LevelLab1 );
      }

      if( ig.input.state('resetLevel') ) {
        this.loadLevel( this.currentLevel );
      }
    } else {
      if (ig.input.pressed('pause')) {
        this.paused = false;
      }
    }
	},

	draw: function() {
    // Draw all entities and backgroundMaps
    this.parent();

    var playerController = ig.game.playerController;

    // Draw HUD
    this.font.draw( 'Score ' + playerController.score, 10, 10, ig.Font.ALIGN.LEFT );

    this.font.draw( 'Health ' + this.player.health, 10, 30, ig.Font.ALIGN.LEFT );

    var lives = playerController.lives;
    var x = ig.system.width - 5;
    var y = 5;

    for(var i = 0; i < lives; i++) {
      x -= this.oneup.width;

      this.oneup.draw(x, y);
    }

    var weaponDisplayName = playerController.getCurrentWeapon().displayName;

    this.font.draw( weaponDisplayName, ig.system.width - 10 - this.font.widthForString(weaponDisplayName), 40, ig.Font.ALIGN.LEFT );
    
    if (this.paused) {
      this.pauseBackground.draw(10, 10, 0, 0, ig.system.width - 20, ig.system.height - 20);

      var weaponTextX = 20;
      var weaponTextY = 20;
      var weaponTextSpacing = 20;
      var weaponXpPercentX = 200;

      if (playerController.weapons.length > 0) {
        this.fontWhite.draw('Weapons:', weaponTextX, weaponTextY, ig.Font.ALIGN.LEFT);

        for (var i = 0; i < playerController.weapons.length; i++) {
          this.fontWhite.draw(playerController.weapons[i].displayName, weaponTextX, weaponTextY + ((i + 1) * weaponTextSpacing), ig.Font.ALIGN.LEFT);
        };
      }

      this.fontWhite.draw('Weapon Progress:', weaponTextX, weaponTextY + ((2 + playerController.weapons.length) * weaponTextSpacing), ig.Font.ALIGN.LEFT);

      if (playerController.weaponXps.length > 0) {
        var validWeaponXpCount = 0;

        for (var i = 0; i < playerController.weaponXps.length; i++) {
          if (playerController.weaponXps[i].xp < 100) {
            this.fontWhite.draw(playerController.weaponXps[i].displayName, weaponTextX, weaponTextY + ((validWeaponXpCount + 3 + playerController.weapons.length) * weaponTextSpacing), ig.Font.ALIGN.LEFT);
            this.fontWhite.draw(playerController.weaponXps[i].xp + '%', weaponXpPercentX, weaponTextY + ((validWeaponXpCount + 3 + playerController.weapons.length) * weaponTextSpacing), ig.Font.ALIGN.LEFT);

            validWeaponXpCount++;
          }
        };
      }
    }
  }
});

StartScreen = ig.Game.extend({
  introTimer: null,
  font: new ig.Font( 'media/04b03.14.black.font.png' ),
  background: new ig.Image('media/rockkickass-marketing-426.png'),

  init: function() {
      ig.input.bind( ig.KEY.SPACE, 'start' );

      ig.music.play('soundtrack');
      ig.music.loop = true;
      ig.music.volume = 0.3;
  },

  update: function() {
    if( ig.input.pressed('start') ) {
      ig.system.setGame(MyGame);
    }
    this.parent();
  },

  draw: function() {
    var x = ig.system.width/2,
        y = ig.system.height - 15;

    this.parent();

    this.background.draw(0,0);

    this.font.draw("Press Spacebar To Start", x, y, ig.Font.ALIGN.CENTER );
  }
});

MusicLoader = ig.Game.extend({
  titleScreen:    new ig.Image('media/rockkickass-marketing-480.png'),
  soundtrack:     new ig.Sound("media/sounds/music/eric_skiff_reistor_anthems.*", false),
  init: function() {
    ig.music.add(this.soundtrack, "soundtrack");
  },
  update: function() {
    ig.system.setGame(StartScreen);
  }
});

if( ig.ua.mobile ) {
  // Disable sound for all mobile devices
  ig.Sound.enabled = false;
}

if( ig.ua.iPhone4 ) {
  // The iPhone 4 has more pixels - we'll scale the
  // game up by a factor of 4
  ig.main( '#canvas', MusicLoader, 60, 160, 160, 4, ig.ImpactSplashLoader );
} else if( ig.ua.mobile ) {
  // All other mobile devices
  ig.main( '#canvas', MusicLoader, 60, 160, 160, 2, ig.ImpactSplashLoader );
} else {
  ig.main( '#canvas', MusicLoader, 60, 480, 300, 2, ig.ImpactSplashLoader );
}
});

window.addEventListener("blur", function () {
  if (ig.system) {
    ig.music.pause();
    ig.system.stopRunLoop();
  }
}, false);

window.addEventListener("focus", function () {
  if (ig.system) {
    ig.music.play();
    ig.system.startRunLoop();
  }
}, false);
