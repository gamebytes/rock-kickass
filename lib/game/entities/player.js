ig.module(
  'game.entities.player'
)
.requires(
  'impact.impact',
  'impact.entity',
  'game.entities.base'
)
.defines(function() {
  EntityPlayer = EntityBase.extend({
    animSheet: new ig.AnimationSheet( 'media/player.png', 64, 64 ),
    originalOffset: { x: 16, y: 9 },
    flipOffset: { x: 27, y: 9 },
    name: 'Rock', // player always has this name
    debrisConfig: {
      enabled: true
    },
    state: 0, // default state is HEALTH
    states: {
      HEALTHY: 0,
      WOUNDED: 1,
      NEARDEATH: 2
    },
    size: { x: 20, y: 55 },
    offset: { x: 18, y: 9 },
    gunOffset: { x: 30, y: 19 },
    health: 100,
    flip: false,
    jumpSFX: new ig.Sound('media/sounds/jump.*'),
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    deathSFX: new ig.Sound('media/sounds/death.*'),
    maxVel: { x: 200, y: 450 },
    friction: { x: 2000, y: 0 },
    accelGround: 2000,
    accelAir: 2000,
    jump: 350,
    startPosition: null,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    invincible: true,
    invincibleDelay: 2,
    invincibleTimer: null,

    hidden: false,

    init: function( x, y, settings ) {
      this.startPosition = { x: x, y: y };
      this.parent( x, y, settings );

      if( settings.hidden ) {
        this.hidden = true;
      }

      this.invincibleTimer = new ig.Timer();
      this.makeInvincible();

      if( ig.game.playerController )
        this.health = ig.game.playerController.health;

      this.setupState();
      this.setupAnimation();
    },

    makeInvincible: function() {
      this.invincible = true;
      this.invincibleTimer.reset();
    },

    receiveDamage: function( amount, from ) {
      if(this.invincible)
        return;
      this.parent(amount, from);

      ig.game.playerController.health = this.health;

      this.setupState();
      this.setupAnimation();
    },

    draw: function() {
      if( !this.hidden  ) {
        if(this.invincible && !ig.global.wm)
          this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
        this.parent();
      }
    },

    kill: function() {

      this.parent();

      var x = this.startPosition.x;
      var y = this.startPosition.y;

      if( ig.game.playerController.lives === 0 ) {
        ig.game.spawnEntity( EffectDeathExplosion, this.pos.x, this.pos.y, {
          callback: function() {
            ig.game.playerController.health = 100;
            ig.game.lastLevel = ig.game.currentLevel;
            ig.game.loadLevel( LevelGameover );
          }
        });
      } else {
        ig.game.playerController.lives--;

        ig.game.spawnEntity( EffectDeathExplosion, this.pos.x, this.pos.y, {
          callback: function() {
            ig.game.playerController.health = 100;
            var player = ig.game.spawnEntity( EntityPlayer, x, y );
            ig.game.player = player;
            ig.game.camera.set( player );
          }
        });
      }

      if(window['_gaq'])
        _gaq.push(['_trackEvent', 'Game Actions', 'Life and Death', 'Player Died']);
    },

    update: function() {
      var accel = this.standing ? this.accelGround : this.accelAir;

      if( ig.input.state('crouch') ) {
        this.currentAnim = this.anims.crouch;
        this.currentAnim.flip.x = this.flip;
        this.parent();
        return;
      }

      if( ig.input.state('left') ) {
        this.accel.x = -accel;
        this.flip = true;
        this.offset = this.flipOffset;
      } else if ( ig.input.state('right') ) {
        this.accel.x = accel;
        this.flip = false;
        this.offset = this.originalOffset;
      } else {
        this.accel.x = 0;
      }

      if( ig.input.pressed('switch') ) {
        ig.game.playerController.nextWeapon();
      }

      if( ig.input.pressed('light') ) {
        this.toggleFlashLight();
      }

      if( this.standing && ig.input.pressed('jump') ) {
        this.vel.y = -this.jump;
        this.jumpSFX.play();
      }

      if( ig.input.pressed('shoot') ) {
        var current_weapon = ig.game.playerController.getCurrentWeapon();
        var position = {
          x: this.pos.x + ( this.flip ? -12 : this.gunOffset.x ),
          y: this.pos.y + ( this.gunOffset.y )
        }
        ig.game.spawnEntity( current_weapon.name, position.x, position.y, { flip: this.flip });
        this.shootSFX.play();
      }

      if( !this.standing && this.vel.y < 0 ) {
        this.currentAnim = this.anims.jump;
      } else if ( !this.standing && this.vel.y > 0 ) {
        this.currentAnim = this.anims.fall;
      } else if ( this.vel.x != 0 ) {
        this.currentAnim = this.anims.run;
      } else {
        if( ig.input.state('shoot') ) {
          this.currentAnim = this.anims.idleFire;
        } else if ( this.standing ) {
          this.currentAnim = this.anims.idle;
        }
      }

      this.currentAnim.flip.x = this.flip;
      if( this.invincibleTimer.delta() > this.invincibleDelay ) {
        this.invincible = false;
        this.currentAnim.alpha = 1;
      }

      if( this.light ) {
        if (this.flip) {
          this.light.angle = 185;
          if( this.currentAnim === this.anims.run ) {
            var animLightOffsets = [
              {x: -40, y: 4},
              {x: -39, y: 0},
              {x: -38, y: -1},
              {x: -38, y: 0},
              {x: -38, y: 4},
              {x: -39, y: 3},
              {x: -40, y: 3},
              {x: -40, y: 2},
              {x: -39, y: 2}
            ];
            this.light.lightOffset = animLightOffsets[this.currentAnim.frame];
          }
          if( this.currentAnim === this.anims.idle )
            this.light.lightOffset = {x: -16, y: 4};
          if( this.currentAnim === this.anims.idleFire )
            this.light.lightOffset = {x: -40, y: -1};
          if( this.currentAnim === this.anims.jump )
            this.light.lightOffset = {x: -40, y: -6};
        } else {
          this.light.angle = 5;
          if( this.currentAnim === this.anims.run ) {
            var animLightOffsets = [
              {x: 40, y: 4},
              {x: 39, y: 0},
              {x: 38, y: -1},
              {x: 38, y: 0},
              {x: 38, y: 4},
              {x: 39, y: 3},
              {x: 40, y: 3},
              {x: 40, y: 2},
              {x: 39, y: 2}
            ];
            this.light.lightOffset = animLightOffsets[this.currentAnim.frame];
          }
          if( this.currentAnim === this.anims.idle )
            this.light.lightOffset = {x: 16, y: 4};
          if( this.currentAnim === this.anims.idleFire )
            this.light.lightOffset = {x: 40, y: -1};
          if( this.currentAnim === this.anims.jump )
            this.light.lightOffset = {x: 40, y: -6};
        }
      }


      this.parent();
    },

    setupState: function() {
      var currentHealth = this.health;

      if( currentHealth > 70 && currentHealth < 101 ) {
        this.state = this.states.HEALTHY;
      } else if (currentHealth > 40 && currentHealth < 71 ) {
        this.state = this.states.WOUNDED;
      } else {
        this.state = this.states.NEARDEATH;
      }
    },

    toggleFlashLight: function() {
      if( this.light ) {
        ig.game.lightManager.removeLight(this.light);
        this.light = null;
      } else {
        this.light = ig.game.lightManager.addLight(this, {
          angle: 5,
          angleSpread: 125,
          radius: 80,
          color:'rgba(255,255,255,0.1)',  // there is an extra shadowColor option
          useGradients: true, // false will use color/ shadowColor
          shadowGradientStart: 'rgba(0,0,0,0.1)',     // 2-stop radial gradient at 0.0 and 1.0
          shadowGradientStop: 'rgba(0,0,0,0.1)',
          lightGradientStart: 'rgba(255,255,100,0.1)',  // 2-stop radial gradient at 0.0 and 1.0
          lightGradientStop: 'rgba(0,0,0,0.6)',
          pulseFactor: 5,
          lightOffset: {x:16,y:0}    // lightsource offset from the middle of the entity
        });
      }
    },

    setupAnimation: function() {
      var offset = this.state * 35 /*the number of frames*/;
      this.addAnim( 'idle', 3, [0 + offset, 1 + offset] );
      this.addAnim( 'idleFire', 1, [30 + offset]);
      this.addAnim( 'run', 0.07, [12 + offset,13 + offset,14 + offset,15 + offset,16 + offset,17 + offset,18 + offset,19 + offset,20 + offset] );
      this.addAnim( 'jump', 0.09, [21 + offset,22 + offset], true );
      this.addAnim( 'fall', 0.4, [22 + offset], true );
      this.addAnim( 'crouch', 0.4, [24 + offset], true );
    }
  });
});
