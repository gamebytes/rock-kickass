ig.module(
  'game.entities.cutscene'
)
.requires(
  'impact.entity',
  'game.entities.instant-earthquake'
)
.defines(function() {
  EntityCutscene = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
    size: {x: 8, y: 8},
    active: false,
    complete: false,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    previousEntity: null,
    currentTextIndex: 0,

    textTimer: null,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      if( settings.autoStart ) {
        this.autoStart = true;
      }
    },

    update: function() {
      if( this.autoStart && !this.active ) {
        this.start();
      }
      if ( this.active ) {
        if ( ig.input.pressed('skip') ) {
          this.end();
        } else if( ig.input.pressed('next') ) {
          this.next();
        } else {
          // Update cut scene
          if( this.currentTextIndex >= this.text.length ) {
            this.end();
          }

          if(this.textTimer.delta() > 3) {
            this.next();
          }
        }
      }
    },

    next: function() {
      this.currentTextIndex++;
      this.textTimer.reset();
    },

    triggeredBy: function( entity, trigger ) {
      if( entity instanceof EntityPlayer ) {
        if( !this.active && !this.complete ) {
          this.start();
        }
      }
    },

    start: function() {
      this.textTimer = new ig.Timer();

      this.active = true;
      this.complete = true;

      this.suspendInput();

      if(this.onstart) {
        this.onstart();
      }
    },

    suspendInput: function() {
      // prevent all user interaction except esc
      ig.game.bindInput('cutscene');
    },

    restoreInput: function() {
      // restore all user interaction
      ig.game.bindInput();
    },

    end: function() {
      if(this.oncomplete) {
        this.oncomplete();
      }

      this.active = false;

      ig.game.camera.set(ig.game.player);

      this.restoreInput();

      // stop the previous entitys animation
      if( this.previousEntity ) {
        this.previousEntity.currentAnim = this.previousEntity.anims.idle;
      }
    },

    draw: function() {
      this.parent();
      if(this.active) {
        if(this.currentTextIndex < this.text.length) {
          var line = this.text[this.currentTextIndex]
            , entity = line.entity
            , x
            , y;

          // stop the previous entitys animation
          if( !line.already && this.previousEntity ) {
            this.previousEntity.currentAnim = this.previousEntity.anims.idle;
          }

          if (line.entity === 'center') {
            x = ig.system.width / 2;
            y = ig.system.height / 2;

            ig.game.font.draw( line.text, x, y, 'center', '#000000');
          } else {
            entity = this.findEntity(line.entity);

            // translate points to camera XY
            x = ig.game.camera.calculatePosition('x', entity.pos.x) + (entity.size.x / 2);
            y = ig.game.camera.calculatePosition('y', entity.pos.y) - 40;

            if( !line.already ) {
              var animationName = line.anim || "talking";

              // animate the talking character
              if( entity.anims[animationName] ) {
                entity.currentAnim = entity.anims[animationName];
              }

              // if an effect type is specified, spawn it
              if( line.effects ) {
                for(var eff = -1, len = line.effects.length; ++eff < len; ) {
                  var effect = line.effects[eff];
                  var effectInstance = this.findEntity( effect );
                  effectInstance.triggeredBy( line.entity, this );
                }
              }

              line.already = true;
            }

            var font = ig.game.font;
            var halfTextWidth = font.widthForString( line.text ) / 2;

            if( x - halfTextWidth < 10 ) {
              x = 10;
              font.draw( line.text, x, y, 'left', '#000000' );
            } else {
              font.draw( line.text, x, y, 'center', '#000000' );
            }

            this.previousEntity = entity;
          }
        }
      }
    },

    findEntity: function( entityDefinition ) {
      var len = entityDefinition.length,
          entity;

      if( entityDefinition === 'this' ) {
        return this;
      } else if( len > entityDefinition.replace(/^type:/ig,'').length ) {
        entity = ig.game.getEntitiesByType( entityDefinition )[0];
      } else {
        entity = ig.game.getEntityByName( entityDefinition );
      }

      return entity;
    }
  });
});
