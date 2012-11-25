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
    checkAgainst: ig.Entity.TYPE.A,
    previousEntity: null,
    currentTextIndex: 0,

    textTimer: null,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      if( settings.autoStart ) {
        this.start();
      }
    },

    update: function() {
      this.parent();
      if ( this.active ) {
        if ( ig.input.pressed('esc') ) {
          this.end();
        } else if( ig.input.pressed('skip') ) {
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
      ig.input.unbindAll();

      ig.input.bind( ig.KEY.ESC, 'esc' );
      ig.input.bind( ig.KEY.SPACE, 'skip' );
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
            x = ig.system.width / 2 - ( ig.game.font.widthForString( line.text ) / 2 );
            y = ig.system.height / 2;

            ig.game.font.draw( line.text, x, y);
          } else {
            entity = this.findEntity(line.entity);

            // translate points to camera XY
            x = entity.pos.x - ig.game.camera.pos.x - ig.game.camera.offset.x + ig.game.camera.trap.pos.x;
            y = entity.pos.y - ig.game.camera.pos.y;


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

            ig.game.font.draw( line.text, x, y, ig.Font.ALIGN.CENTER );
            this.previousEntity = entity;
          }
        }
      }
    },

    findEntity: function( entityDefinition ) {
      var len = entityDefinition.length,
          entity;
      if( len > entityDefinition.replace(/^type:/ig,'').length ) {
        entity = ig.game.getEntitiesByType( entityDefinition )[0];
      } else {
        entity = ig.game.getEntityByName( entityDefinition );
      }
      return entity;
    }
  });
});
