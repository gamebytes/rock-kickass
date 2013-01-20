ig.module(
  'game.main'
)
.requires(
  'impact.game',

  'plugins.impact-splash-loader',
  'plugins.touch-button',
  'plugins.font',

  'fragcastle.plugins.font-render-switcher',

  // Using native font plugin above
  // 'impact.font',

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
  'game.levels.sewer1',

  'game.levels.enemy-soldier-test',

  'game.levels.gameover',

  'game.weapons.pea',
  'game.weapons.grenade',
  'game.weapons.shotgun',
  'game.weapons.beam',
  'game.weapons.bfg',
  'game.weapons.rocket-launcher',

  'game.effects.weapon-xp',
  'game.effects.weapon-acquired',
  'game.entities.health-bar'

  , 'impact.debug.debug'
)
.defines(function() {

MyGame = ig.Game.extend({

	// Load fonts
  font: ig.ua.mobile ? new Font('20px 04B_03_') : new ig.Font( 'media/04b03.16.black.font.png' ),
  font8: ig.ua.mobile ? new Font('8px 04B_03_') : new ig.Font( 'media/manaspace.8.black.font.png' ),

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

  // Input
  buttonSize: 80,

  // Settings
  drawButtons: true,

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

    this.setupInput(this.buttonSize);

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

		// Initialize your game here; bind keys etc.
    this.loadLevel( q.level ? ig.global[q.level] : LevelLabcutscene1 );

    if(q.weapon) {
      this.addWeapon(q.weapon);
    }

    ig.game.bindInput = this.bindInput;
    ig.game.bindInput();
  },

  setupInput: function(buttonSize) {
    this.normalButtons = [
      new ig.TouchButton( 'pause', 0, 0, 80, buttonSize, this.buttonImage, 2 ),
      new ig.TouchButton( 'left', 0, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 0 ),
      new ig.TouchButton( 'right', buttonSize, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 1 ),
      new ig.TouchButton( 'jump', ig.system.width - buttonSize * 2, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 3 ),
      new ig.TouchButton( 'shoot', ig.system.width - buttonSize, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 2 ),
      new ig.TouchButton( 'switch', ig.system.width - buttonSize, 0, 80, buttonSize, this.buttonImage, 2 )
    ];

    this.pauseButtons = [
      new ig.TouchButton( 'exit', 0, 0, 80, buttonSize, this.buttonImage, 2 )
    ];

    this.cutsceneButtons = [
      new ig.TouchButton( 'skip', ig.system.width / 2 - buttonSize / 2, 0, 80, buttonSize, this.buttonImage, 2 ),
      new ig.TouchButton( 'next', ig.system.width - buttonSize, ig.system.height - buttonSize, 80, buttonSize, this.buttonImage, 1 )
    ];
  },

  bindInput: function(mode) {
    ig.input.unbindAll();

    if (this.buttons) {
      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].disable();
      }
    }

    var buttonSize = 80;

    if (mode === 'cutscene') {
      ig.input.bind( ig.KEY.ESC, 'skip' );
      ig.input.bind( ig.KEY.SPACE, 'next' );

      this.buttons = this.cutsceneButtons;
    } else if (mode === 'paused') {
      ig.input.bind( ig.KEY.ESC, 'exit' );

      ig.input.bind( ig.KEY.LEFT_ARROW, 'back' );

      ig.input.bind( ig.KEY.UP_ARROW, 'up' );
      ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );

      ig.input.bind( ig.KEY.ENTER, 'enter' );

      this.buttons = this.pauseButtons;
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

      this.buttons = this.normalButtons;
    }

    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].enable();
    };
  },

  addWeapon: function( weapon ) {
    var w = ig.global[weapon];
    ig.game.playerController.addWeapon( new w(), -1 );
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
      this.hud.update();

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

    this.hud.draw(); // draw the hud AFTER we draw the entities and layers

    if (this.paused) {
      this.pauseScreen.draw();
    }

    if( this.drawButtons ) {
      // Draw touch buttons
      ig.system.context.globalAlpha = 0.2;

      if ( this.buttons ) {
        for( var i = 0; i < this.buttons.length; i++ ) {
          this.buttons[i].draw();
        }
      }

      ig.system.context.globalAlpha = 1;
    }
  }
});

StartScreen = ig.Game.extend({
  introTimer: null,
  font: ig.ua.mobile ? new Font('20px 04B_03_') : new ig.Font( 'media/04b03.16.black.font.png' ),
  background: new ig.Image('media/rockkickass-marketing-426.png'),

  init: function() {
      ig.input.bind( ig.KEY.SPACE, 'start' );

      // Start button
      var button = new ig.TouchButton( 'start', 0, 0, ig.system.width, ig.system.height, null, null, true );

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

    this.font.draw("Press Spacebar To Start", x, y, ig.fontRenderSwitcher.align.center, '#000000');
  }
});

MusicLoader = ig.Game.extend({
  titleScreen:    new ig.Image('media/rockkickass-marketing-480.png'),
  soundtrack:     new ig.Sound("media/sounds/music/Were_The_Resistors.*", false),
  init: function() {
    // ig.music.add(this.soundtrack, "soundtrack");
  },
  update: function() {
    ig.system.setGame(StartScreen);
  }
});

var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);

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
