ig.module(
  'game.entities.cutscene'
)
.requires(
  'impact.entity'
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

    currentTextIndex: 0,

    textTimer: null,

    init: function(x, y, settings) {
      this.parent(x, y, settings);

      if( settings.autoStart ) {
        this.start();
      }
    },

    update: function() {
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
    },

    draw: function() {
      this.parent();
      if(this.active) {
        if(this.currentTextIndex < this.text.length) {
          var line = this.text[this.currentTextIndex]
            , entity = line.entity
            , x
            , y;

          if (line.entity === 'center') {
            x = ig.system.width / 2;
            y = ig.system.height / 2;

            ig.game.font.draw( line.text, x, y, ig.Font.ALIGN.CENTER);
          } else {
            entity = this.findEntity(line.entity);

            // translate points to camera XY
            x = entity.pos.x - ig.game.camera.pos.x - ig.game.camera.offset.x + ig.game.camera.trap.pos.x;
            y = entity.pos.y - ig.game.camera.pos.y;

            x = ig.game.camera.calculatePosition('x', entity.pos.x) + (entity.size.x / 2);
            y = ig.game.camera.calculatePosition('y', entity.pos.y) - 20;

            ig.game.font.draw( line.text, x, y, ig.Font.ALIGN.CENTER );

            ig.game.font.draw( line.text, x, y, ig.Font.ALIGN.CENTER );
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
