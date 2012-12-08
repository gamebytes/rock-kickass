ig.module(
	'game.main'
)
.requires(
  'plugins.impact-splash-loader',
  'plugins.timeslower',
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
  font14: new ig.Font( 'media/04b03.14.black.font.png' ),
  oneup: new ig.Image('media/1up.png'),
	gravity: 700,
  camera: null,
  currentLevel: null,
  clearColor: "#FFFFFF",

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
    ig.input.bind( ig.KEY.ESC, 'esc' );

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
		// Update all entities and backgroundMaps
    this.camera.update();
    this.parent();

    if( ig.input.state('reset') ) {
      this.loadLevel( LevelLab1 );
    }

    if( ig.input.state('resetLevel') ) {
      this.loadLevel( this.currentLevel );
    }
	},

	draw: function() {
    var playerController = ig.game.playerController;

		// Draw all entities and backgroundMaps
		this.parent();

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
	}
});

StartScreen = ig.Game.extend({
  introTimer: null,
  font: new ig.Font( 'media/04b03.14.black.font.png' ),
  background: new ig.Image('media/rockkickass-marketing-426.png'),

  init: function() {
      ig.input.bind( ig.KEY.SPACE, 'start' );
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
  
  init: function() {
    
  },
  update: function() {
    ig.system.setGame(StartScreen);
  }
});

var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);

var btn_dwn = document.createElement('img');
btn_dwn.src="touchstart.png";
btn_dwn.id="btn_dwn";
btn_dwn.style.position='absolute';
btn_dwn.style.width = 100;
btn_dwn.style.height = 100;
btn_dwn.style.left = window.innerWidth / 2 - 50; //(window.innerHeight/4)-(btn_lft.height/2);
btn_dwn.style.top = 0;
btn_dwn.addEventListener("touchstart", function(){
    ig.system.setGame(MyGame);
});
document.body.appendChild(btn_dwn);


var btnLeft = document.createElement('img');
btnLeft.src="touchstart.png";
btnLeft.id="btnLeft";
btnLeft.style.position='absolute';
btnLeft.style.width = 200;
btnLeft.style.height = 200;
btnLeft.style.left = 0;
btnLeft.style.bottom = 0;
btnLeft.addEventListener("touchstart", function(){
    ig.game.player.goLeftStart();
});
btnLeft.addEventListener("touchend", function(){
    ig.game.player.goLeftEnd();
});
document.body.appendChild(btnLeft);


var btnRight = document.createElement('img');
btnRight.src="touchstart.png";
btnRight.id="btnRight";
btnRight.style.position='absolute';
btnRight.style.width = 200;
btnRight.style.height = 200;
btnRight.style.left = 200;
btnRight.style.bottom = 0;
btnRight.addEventListener("touchstart", function(){
    ig.game.player.goRightStart();
});
btnRight.addEventListener("touchend", function(){
    ig.game.player.goRightEnd();
});
document.body.appendChild(btnRight);


var btnJump = document.createElement('img');
btnJump.src="touchstart.png";
btnJump.id="btnJump";
btnJump.style.position='absolute';
btnJump.style.width = 200;
btnJump.style.height = 200;
btnJump.style.left = window.innerWidth - 400;
btnJump.style.bottom = 0;
btnJump.addEventListener("touchstart", function(){
    ig.game.player.jump();
});
document.body.appendChild(btnJump);


var btnShoot = document.createElement('img');
btnShoot.src="touchstart.png";
btnShoot.id="btnShoot";
btnShoot.style.position='absolute';
btnShoot.style.width = 200;
btnShoot.style.height = 200;
btnShoot.style.left = window.innerWidth - 200;
btnShoot.style.bottom = 0;
btnShoot.addEventListener("touchstart", function(){
    ig.game.player.shoot();
});
document.body.appendChild(btnShoot);

// Disable sound for all mobile devices
ig.Sound.enabled = false;

ig.main( '#canvas', MusicLoader, 60, 480, 300, 1, ig.ImpactSplashLoader );
});
