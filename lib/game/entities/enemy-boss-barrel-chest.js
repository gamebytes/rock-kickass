ig.module(
  'game.entities.enemy-boss-barrel-chest'
)
.requires(
  'impact.entity',
  'game.entities.enemy-base',
  'game.weapons.bfg' // yeah, shit just got real
)
.defines( function() {
  EntityEnemyBossBarrelChest = EntityEnemyBase.extend({
    animSheet: new ig.AnimationSheet( 'media/barrel-chest.png', 64, 64 ),
    size: { x: 34, y: 59 },
    offset: { x: 20, y: 5 },
    maxVel: { x: 500, y: 100 },
    gunOffset: { x: 0, y: 0 },
    name: 'BarrelChest',
    hestationTime: 2,
    hesitationTimer: null,
    attackTimer: null,
    attackTime: 4,
    fireTimer: null,
    fireTime: 0.2,
    flip: false,
    friction: { x: 50, y: 50 },
    speed: 300,
    maxHealth: 240,
    health: 240,
    enabled: true,
    possiblePoints: [100], // will award the BFG after you defeat him
    maxHoverDistance: 150,
    gravityFactor: 0,
    scoreValue: 100000,
    debrisConfig: {
      enabled: true,
      particleConfig: {
        animSheet: new ig.AnimationSheet('media/barrel-chest-debris.png', 8, 8)
      }
    },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );

      this.addAnim( 'idle', 1, [0], true );
      this.addAnim( 'flying', .1, [1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,2,2,2,2,2,1,1,1] );
      this.addAnim( 'shooting', .02, [3,3,4,4,5,5] );

      this.attackTimer = new ig.Timer(this.attackTime);

      this.setFlying();

      this.rewardWeapon = new WeaponBfg();
    },
    setIdle: function() {
      this.currentAnim = this.anims.idle; // set the animation to idle
    },
    setFlying: function() {
      this.currentAnim = this.anims.flying.rewind();
    },
    setShooting: function() {
      this.currentAnim = this.anims.shooting.rewind();
    },
    isShooting: function() {
      return this.currentAnim === this.anims.shooting;
    },
    isFlying: function() {
      return this.currentAnim === this.anims.flying;
    },
    update: function() {
      if(this.enabled) {
        if( this.isShooting() ) {
          this.vel.x *= 0.5;
          this.vel.y *= 0.5;
        }
        if( this.isFlying() ) {
          this.accel.x = this.accel.y = 0;
          var playerPos = this.playerPosition();
          if( playerPos.x > this.pos.x ) {
            // player is to our right
            this.flip = false;
            if( playerPos.x > (this.pos.x + 100) ) {
              // move closer to the player
              this.accel.x = this.speed;
            }
          }

          if( playerPos.x < this.pos.x ) {
            // player is to our left
            this.flip = true;
            if( playerPos.x < (this.pos.x - 100) ) {
              // move closer to the player
              this.accel.x = -this.speed;
            }
          }

          var hoverDistance = this.pos.y + this.maxHoverDistance;

          if( playerPos.y > hoverDistance-5  && playerPos.y < hoverDistance + 5 ) {
            // change to vel to make him stop as soon as he is within hoverDistance of player
            this.accel.y = 0; // we're at our max hover distance, stop moving
          } else if ( this.pos.y + this.maxHoverDistance < playerPos.y ) {
            this.accel.y = this.speed;
          } else  if ( this.pos.y + this.maxHoverDistance > playerPos.y ) {
            this.accel.y = -this.speed;
          }

          var coin = Math.floor(Math.random()*5);
          if( coin  < 3 )
            this.accel.y = 0;
        }
      }

      // this should really be in a base class somewhere... hate typing this out all the time
      this.currentAnim.flip.x = this.flip;

      this.parent();
    },

    fireBFG: function() {
      var offset = { x: this.gunOffset.x + this.pos.x, y: this.gunOffset.y + this.pos.y };
      ig.game.spawnEntity( EntityBfgProjectile, offset.x, offset.y, {
        flip: this.flip,
        checkAgainst: ig.Entity.TYPE.A,
        vel: { x: 200, y: 100 },
        rotation: this.flip ? 45 : 135
      });
    },

    attack: function() {
      if( this.attackTimer && this.attackTimer.delta() >= 0 ) {
        if( !this.isShooting() ) {
          this.setShooting();
          this.timesFired = 0;
          this.attackTimer = null;
          this.fireTimer = new ig.Timer( this.fireTime );
        }
      }

      if( this.fireTimer && this.fireTimer.delta() >= 0 && this.isShooting() ) {
        var healthPercentage = Math.floor(this.health/this.maxHealth * 100),
            timesToFire = 1;

        if( healthPercentage < 75 ) {
          timesToFire++;
          this.attackTime = 1.5;
          this.hestationTime = 1.5;
        }
        if( healthPercentage < 50 ) {
          timesToFire++;
          this.attackTime = 1;
          this.hestationTime = 1;
        }
        if( healthPercentage < 25 ) {
          timesToFire++;
          this.attackTime = 0.7;
          this.hestationTime = 0.8;
        }

        if( this.timesFired++ === timesToFire ) {
          this.fireTimer = null;
          this.hesitationTimer = new ig.Timer( this.hestationTime );
        } else {
          this.fireBFG();
          this.fireTimer.reset();
        }
      }

      if( this.hesitationTimer && this.hesitationTimer.delta() >= 0 ) {
        this.setFlying();
        this.attackTimer = new ig.Timer(this.attackTime);
        this.hesitationTimer = null;
      }

      return; // override, but don't call the base function
    },

    kill: function() {
      this.parent();

      // TODO: Death Animation/cutscene
    },

    receiveDamage: function(amount, from) {
      this.parent(amount, from); // barrel chest can be damaged anytime
    },

    handleMovementTrace: function( res ) {
      this.parent(res);
    }
  });
})
