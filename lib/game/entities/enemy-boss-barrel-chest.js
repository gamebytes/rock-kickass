ig.module(
  'game.entities.enemy-boss-barrel-chest'
)
.requires(
  'impact.entity',
  'game.entities.enemy-base'
)
.defines( function() {
  EntityEnemyBossBarrelChest = EntityEnemyBase.extend({
    animSheet: new ig.AnimationSheet( 'media/barrel-chest.png', 64, 64 ),
    size: { x: 34, y: 59 },
    offset: { x: 20, y: 5 },
    maxVel: { x: 500, y: 100 },
    name: 'BarrelChest',
    hestationTime: 2,
    hesitationTimer: null,
    fireTimer: null,
    fireTime: 2,
    flip: false,
    friction: { x: 50, y: 50 },
    speed: 300,
    maxHealth: 600,
    health: 600,
    enabled: true,
    startY: null,
    maxHoverDistance: 80,
    gravityFactor: 0,
    scoreValue: 100000,
    debrisConfig: {
      enabled: true,
      particleConfig: {
        animSheet: new ig.AnimationSheet('media/basher-debris.png', 8, 8)
      }
    },

    init: function( x, y, settings ) {
      this.parent( x, y, settings );
      this.startY = y;

      this.addAnim( 'idle', 1, [0], true );
      this.addAnim( 'flying', .1, [1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,2,2,2,2,2,1,1,1] );
      this.addAnim( 'shooting', .02, [3,3,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,4,4,4,4,4,4,4,3,3,3,3,3] );

      this.fireTimer = new ig.Timer();
      this.hesitationTimer = new ig.Timer();

      this.setIdle();
      this.shouldFly = true;
    },
    setIdle: function() {
      this.currentAnim = this.anims.idle; // set the animation to idle
    },
    update: function() {
      if(this.enabled) {
        if( this.shouldShoot || EntityEnemyBossBarrelChest.shouldShoot ) {
          this.currentAnim = this.anims.shooting;
        } else if( this.shouldFly || EntityEnemyBossBarrelChest.shouldFly ) {
          this.currentAnim = this.anims.flying;
        }

        if( this.shouldFly || EntityEnemyBossBarrelChest.shouldFly ) {
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

    attack: function() {
      if( this.shouldShoot || EntityEnemyBossBarrelChest.shouldShoot ) {
        console.log( 'attacking' );
      }
      return; // basher doesn't have a traditional attack
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
