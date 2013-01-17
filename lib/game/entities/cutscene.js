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
    previousAct: null,
    currentTextIndex: 0,
    currentAct: null,

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
          if( this.currentTextIndex >= this.acts.length ) {
            this.end();
          }

          var currentAct = this.acts[this.currentTextIndex];
          if( this.acts && currentAct ) {
            if( currentAct.animation && currentAct.animation.anim ) {
              currentAct.animation.anim.update();
            }

            var shouldAdvance = (currentAct.animation && currentAct.animation.loopCount > 0) || (this.textTimer.delta() > 3);
            if ( shouldAdvance ) {
              this.next();
            }
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

      ig.game.hud.enabled = false;

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

      ig.game.hud.enabled = true;

      // stop the previous entitys animation
      if( this.previousAct ) {
        this.previousAct.currentAnim = this.previousAct.anims.idle;
      }
    },

    draw: function() {
      if(this.active) {
        var context = ig.system.context;

        var boxHeight = ig.system.getDrawPos(40);
        var width = ig.system.getDrawPos(ig.system.width);
        var height = ig.system.getDrawPos(ig.system.height);

        context.fillStyle = '#000';
        context.fillRect(0, 0, width, boxHeight);
        context.fillRect(0, height - boxHeight, width, boxHeight);

        if(this.currentTextIndex < this.acts.length) {
          var act = this.acts[this.currentTextIndex]
            , entity = act.entity
            , x
            , y;

          // stop the previous entitys animation
          if( !act.already && this.previousAct ) {
            this.previousAct.currentAnim = this.previousAct.anims.idle;
          }

          if (act.entity === 'center') {
            x = ig.system.width / 2;
            y = ig.system.height / 2;

            ig.game.font.draw( act.text, x, y, ig.fontRenderSwitcher.align.center, '#000000');
          } else if ( act.animation ) {
            // center the animation within the screen
            // we do this because different devices can have
            // very different resolutions
            var sheet = this['animation'+act.animation.name];
            x = (ig.system.width / 2) - (sheet.width / 2);
            y = (ig.system.height / 2) - (sheet.height / 2);

            if( !act.animation.anim ) {
              act.animation.anim = new ig.Animation( sheet, act.animation.frameDuration, act.animation.frames, true );
            }

            act.animation.anim.draw(x,y);
          } else {
            entity = this.findEntity(act.entity);

            // translate points to camera XY
            x = ig.game.camera.calculatePosition('x', entity.pos.x) + (entity.size.x / 2);
            y = ig.game.camera.calculatePosition('y', entity.pos.y) - 40;

            if( !act.already ) {
              var animationName = act.anim || "talking";

              // animate the talking character
              if( entity.anims[animationName] ) {
                entity.currentAnim = entity.anims[animationName];
              }

              // if an effect type is specified, spawn it
              if( act.effects ) {
                for(var eff = -1, len = act.effects.length; ++eff < len; ) {
                  var effect = act.effects[eff];
                  var effectInstance = this.findEntity( effect );
                  effectInstance.triggeredBy( act.entity, this );
                }
              }

              act.already = true;
            }

            var font = ig.game.font;
            var halfTextWidth = font.widthForString( act.text ) / 2;

            if( x - halfTextWidth < 10 ) {
              x = 10;
              font.draw( act.text, x, y, ig.fontRenderSwitcher.align.left, '#000000' );
            } else {
              font.draw( act.text, x, y, ig.fontRenderSwitcher.align.center, '#000000' );
            }

            this.previousAct = entity;
          }
        }
      }
      this.parent();
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
