ig.module(
	'game.main'
)
.requires(
  'plugins.impact-splash-loader',
  'plugins.touch-button',

	'impact.game',
	'impact.font',

  'game.directors.player-controller',
  'game.directors.camera',
  'game.directors.hud',
  'game.directors.pause-screen',

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

  'game.levels.enemy-soldier-test',

  'game.levels.gameover',

  'game.weapons.pea',
  'game.weapons.grenade',
  'game.weapons.shotgun',
  'game.weapons.beam',

  'game.effects.weapon-xp',
  'game.effects.weapon-acquired',
  'game.entities.health-bar',
  'impact.debug.debug'
)
.defines(function() {

MyGame = ig.Game.extend({

	// Load a font
  font: new ig.Font( 'media/04b03.16.black.font.png' ),
  fontWhite: new ig.Font( 'media/04b03.14.white.font.png' ),
  font14: new ig.Font( 'media/04b03.14.black.font.png' ),

  pauseBackground: new ig.Image('media/pause-background.png'),
  oneup: new ig.Image('media/1up.png'),
  arrowImage: new ig.Image('media/menu_arrow.png'),
  buttonImage: new ig.Image('media/mobile-buttons.png'),

	gravity: 700,

  camera: null,
  hud: null,

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

    this.hud = new ig.Hud();
    this.pauseScreen = new ig.PauseScreen([
      {
        text: "Sound", 
        display: function() { return "Sound " + (ig.Sound.enabled ? "enabled" : "disabled"); }, 
        action: function() {
          ig.Sound.enabled = !ig.Sound.enabled;

          if (ig.Sound.enabled) {
            ig.music.play();
          } else {
            ig.music.pause();
          }
        }
      }
    ]);

    this.loadLevel( q.level ? ig.global[q.level] : LevelLabcutscene1 );

    if(q.weapon) {
      this.addWeapon(q.weapon);
    }

    ig.game.bindInput = this.bindInput;
    ig.game.bindInput();
	},

  bindInput: function(mode) {
    ig.input.unbindAll();

    if (mode === 'cutscene') {
      ig.input.bind( ig.KEY.ESC, 'skip' );
      ig.input.bind( ig.KEY.SPACE, 'next' );
    } else if (mode === 'paused') {
      ig.input.bind( ig.KEY.ESC, 'exit' );

      ig.input.bind( ig.KEY.LEFT_ARROW, 'back' );

      ig.input.bind( ig.KEY.UP_ARROW, 'up' );
      ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );

      ig.input.bind( ig.KEY.ENTER, 'enter' );
    } else {
      // Sneaky stuff
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
    }

    // For Mobile Browsers and Ejecta
    if( ig.ua.mobile ) {
      var buttonSize = 96;

      this.buttons = [
        new ig.TouchButton( 'esc', ig.system.width / 2 - buttonSize / 2, 0, 80, buttonSize, this.buttonImage, 2 ),
        new ig.TouchButton( 'left', 0, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 0 ),
        new ig.TouchButton( 'right', buttonSize, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 1 ),
        new ig.TouchButton( 'jump', ig.system.width - buttonSize * 2, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 3 ),
        new ig.TouchButton( 'shoot', ig.system.width - buttonSize, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 2 ),
        new ig.TouchButton( 'switch', ig.system.width - buttonSize, 0, 80, buttonSize, this.buttonImage, 2 )
      ];
    }
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

        this.bindInput('paused');

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
      if (ig.input.pressed('exit')) {
        this.paused = false;

        this.bindInput();
      }

      this.pauseScreen.update();
    }
	},

	draw: function() {
    // Draw all entities and backgroundMaps
    this.parent();

    this.hud.draw();
    
    if (this.paused) {
      this.pauseScreen.draw();      
    }
  }
});

StartScreen = ig.Game.extend({
  introTimer: null,
  font: new ig.Font( 'media/04b03.14.black.font.png' ),
  background: new ig.Image('media/rockkickass-marketing-426.png'),

  init: function() {
      ig.input.bind( ig.KEY.SPACE, 'start' );

      // For Mobile Browsers and Ejecta
      if( ig.ua.mobile ) {
        var ypos = ig.system.height - 48;

        this.buttons = [
          new ig.TouchButton( 'start', 0, 0, ig.system.width, ig.system.height )
        ];
      }

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

// Custom device detection
ig.ua.iPhone5 = (ig.ua.iPhone && ig.ua.pixelRatio == 2 && window.screen.height === 568);

if( ig.ua.iPhone5 ) {
  // The iPhone 5 has more pixels - we'll scale the game up by a factor of 2
  ig.main( '#canvas', MusicLoader, 30, 500, 280, 2, ig.ImpactSplashLoader );
} else if( ig.ua.iPhone4 ) {
  // The iPhone 4 has more pixels - we'll scale the game up by a factor of 2
  ig.main( '#canvas', MusicLoader, 30, 480, 320, 2, ig.ImpactSplashLoader );
} else if( ig.ua.mobile ) {
  // All other mobile devices
  var height = 320;
  var scale = window.innerHeight / height;
  var width = window.innerWidth / scale;
  ig.main( '#canvas', MusicLoader, 30, width, height, 1, ig.ImpactSplashLoader );
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
