ig.module(
  'game.entities.enemy-soldier'
)
.requires(
  'impact.entity',
  'game.entities.effect-death-explosion',
  'game.weapons.enemy-eyebeams'
)
.defines( function() {
  EntityEnemySoldier = ig.Entity.extend({
    deathSFX: new ig.Sound('media/sounds/enemy_death.*'),
    hitSFX: new ig.Sound('media/sounds/enemy_hit.*'),
    animSheet: new ig.AnimationSheet( 'media/soldier.png', 64, 64 ),
    originalOffset: { x: 16, y: 29 },
    flipOffset: { x: 20, y: 29 },
    size: { x: 20, y: 35 },
    offset: { x: 16, y: 29 },
    gunOffset: { x: 16, y: -10 },
    flip: false,
    shootSFX: new ig.Sound('media/sounds/eyebeams.*'),
    maxVel: { x: 200, y: 450 },
    friction: { x: 2000, y: 0 },
    accelGround: 500,
    maxHealth: 45,
    health: 45,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,
    enabled: true,
    scoreValue: 500,
    hestationTime: 2,
    weaponFireTime: 2,
    weaponFireTimer: new ig.Timer(),
    hesitationTimer: new ig.Timer(),
    speed: 100,

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.setupAnimation();

      if( !ig.global.wm ) {
        ig.game.spawnEntity(EntityHealthBar, this.pos.x, this.pos.y, { entity: this });
      }
    },

    setIdle: function() {
      this.hesitationTimer.set( this.hestationTime ); // set the rest timer
      this.currentAnim = this.anims.idle; // set the animation to idle
      this.weaponFireTimer.set( this.weaponFireTime );
    },

    update: function() {
      var playerPos = ig.game.player.pos;

      if(this.enabled) {
        if( this.hesitationTimer.delta() > 0 ) {
          var isNearWall = !ig.game.collisionMap.getTile(
              this.pos.x + (this.flip ? +4 : this.size.x - 4),
              this.pos.y + this.size.y+1
            );

          if ( playerPos.x > (this.pos.x - 250) && playerPos.x < (this.pos.x + 250)) {
            // if the player is to the left of the enemy
            // and we're not heading that direction already
            // turn the enemy to face the player so he can shoot
            if( this.pos.x < playerPos.x ) {
              this.flip = false;
            } else {
              this.flip = true;
            }
            this.vel.x = 0; // stop walking when the player is near
            this.currentAnim = this.anims.idleFire;
            if( this.weaponFireTimer.delta() > 0 ) {
              // spawn the weapon
              var position = {
                x: this.pos.x + ( this.flip ? -8 : this.gunOffset.x ),
                y: this.pos.y + ( this.gunOffset.y )
              };
              ig.game.spawnEntity( WeaponEnemyEyebeams, position.x, position.y, { flip: this.flip });
              this.shootSFX.play();
              this.weaponFireTimer.reset();
            }
          } else if( isNearWall ) {
            this.setIdle();
            this.flip = !this.flip;
          } else {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.currentAnim = this.anims.run;
          }
        }

        this.currentAnim.flip.x = this.flip;

        this.parent();
      }
    },

    kill: function() {
      this.parent();

      ig.game.playerController.score += this.scoreValue;

      this.deathSFX.play();
      ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, { colorOffset: 1 });
    },

    receiveDamage: function(value) {
      this.parent(value);
      if(this.health > 0) {
        this.hitSFX.play();
        ig.game.spawnEntity( EntityEffectDeathExplosion, this.pos.x, this.pos.y, {
          particles: value,
          colorOffset: 1
        });
      }
    },

    handleMovementTrace: function( res ) {
      this.parent(res);

      if( res.collision.x ) {
        this.flip = !this.flip;
        this.setIdle();
      }
    },

    check: function( other ) {
      other.receiveDamage( 1000, this );
    },

    setupAnimation: function() {
      this.addAnim( 'idle', 1, [0,1] );
      this.addAnim( 'idleFire', 1, [12]);
      this.addAnim( 'run', 0.1, [2,3,4,5,6,7,8,9,10,11] );
    }
  });
})
