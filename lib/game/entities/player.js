ig.module(
  'game.entities.player'
)
.requires(
  'impact.impact',
  'impact.entity'
)
.defines(function() {
  EntityPlayer = ig.Entity.extend({
    animSheet: new ig.AnimationSheet( 'media/player.png', 64, 64 ),
    size: { x: 40, y: 56 },
    offset: { x: 4, y: 8 },
    originalOffset: { x: 4, y: 8 },
    flipOffset: { x: 20, y: 8 },
    gunOffset: { x: 32, y: 16 },
    flip: false,
    jumpSFX: new ig.Sound('media/sounds/jump.*'),
    shootSFX: new ig.Sound('media/sounds/shoot.*'),
    deathSFX: new ig.Sound('media/sounds/death.*'),
    maxVel: { x: 200, y: 450 },
    friction: { x: 2000, y: 0 },
    accelGround: 500,
    accelAir: 500,
    jump: 350,
    startPosition: null,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.PASSIVE,
    invincible: true,
    invincibleDelay: 2,
    invincibleTimer: null,

    init: function( x, y, settings ) {
      this.startPosition = { x: x, y: y };
      this.parent( x, y, settings );

      this.setupAnimation();

      this.invincibleTimer = new ig.Timer();
      this.makeInvincible();
    },

    makeInvincible: function() {
      this.invincible = true;
      this.invincibleTimer.reset();
    },

    receiveDamage: function( amount, from ) {
      if(this.invincible)
        return;
      this.parent(amount, from);
    },

    draw: function() {
      if(this.invincible && !ig.global.wm)
        this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
      this.parent();
    },

    kill: function() {
      var x = this.startPosition.x;
      var y = this.startPosition.y;

      ig.game.playerController.lives--;
      
      this.parent();
      
      ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, {
        callback: function() {
          var player = ig.game.spawnEntity( EntityPlayer, x, y );

          ig.game.player = player;
          ig.game.camera.set( player );
        }
      });

      this.deathSFX.play();
    },

    update: function() {
      var accel = this.standing ? this.accelGround : this.accelAir;

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
        this.setupAnimation();
      }

      if( this.standing && ig.input.pressed('jump') ) {
        this.vel.y = -this.jump;
        this.jumpSFX.play();
      }

      if( ig.input.pressed('shoot') ) {
        var current_weapon = ig.game.playerController.getCurrentWeapon();
        ig.game.spawnEntity( current_weapon.name, this.pos.x + this.gunOffset.x, this.pos.y + this.gunOffset.y, { flip: this.flip });
        this.shootSFX.play();
      }

      if( this.vel.y < 0 ) {
        this.currentAnim = this.anims.jump;
      } else if ( this.vel.y > 0 ) {
        this.currentAnim = this.anims.fall;
      } else if ( this.vel.x != 0 ) {
        this.currentAnim = this.anims.run;
      } else {
        if( ig.input.state('shoot') ) {
          this.currentAnim = this.anims.idleFire;
        } else {
          this.currentAnim = this.anims.idle;
        }
      }

      this.currentAnim.flip.x = this.flip;
      if( this.invincibleTimer.delta() > this.invincibleDelay ) {
        this.invincible = false;
        this.currentAnim.alpha = 1;
      }
      this.parent();
    },

    setupAnimation: function() {
      this.addAnim( 'idle', 1, [0,1] );
      this.addAnim( 'idleFire', 1, [30]);
      this.addAnim( 'run', 0.1, [12,13,14,15,16,17,18,19,20] );
      this.addAnim( 'jump', 0.09, [21,22], true );
      this.addAnim( 'fall', 0.4, [22], true );
    }
  });
});
