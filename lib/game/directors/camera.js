ig.module(
  'game.directors.camera'
)
.defines(function () {
  ig.Camera = ig.Class.extend({
    trap: {
        pos: { x: 0, y: 0},
        size: { x: 64, y: 64 }
    },
    max: { x: 0, y: 0 },
    offset: {x: 0, y:0},
    pos: {x: 0, y: 0},
    damping: 5,
    lookAhead: { x: 0, y: 0},
    currentLookAhead: { x: 0, y: 0},
    shake: { x: 0, y: 0},

    entity: null,

    debug: false,

    init: function( offsetX, offsetY, damping ) {
        this.offset.x = offsetX;
        this.offset.y = offsetY;
        this.damping = damping;
    },


    set: function( entity ) {
        this.pos.x = entity.pos.x - this.offset.x;
        this.pos.y = entity.pos.y - this.offset.y;

        this.trap.pos.x = entity.pos.x - this.trap.size.x / 2;
        this.trap.pos.y = entity.pos.y - this.trap.size.y;

        this.entity = entity;
    },


    update: function() {
      if(this.entity) {
        this.pos.x = this.calculateMove( 'x', this.entity.pos.x, this.entity.size.x, this.entity.flip );
        this.pos.y = this.calculateMove( 'y', this.entity.pos.y, this.entity.size.y, this.entity.flip );

        ig.game.screen.x = this.pos.x;
        ig.game.screen.y = this.pos.y;
      }
    },


    move: function(x, y) {
      this.entity = null;

      ig.game.screen.x = x;
      ig.game.screen.y = y;
    },


    calculateMove: function( axis, pos, size, flip ) {
        var lookAhead = 0;

        if(typeof(flip) === 'undefined') {
            flip = false;
        }

        if( pos < this.trap.pos[axis] ) {
            this.trap.pos[axis] = pos;
            this.currentLookAhead[axis] = this.lookAhead[axis];
        }
        else if( pos + size > this.trap.pos[axis] + this.trap.size[axis] ) {
            this.trap.pos[axis] = pos + size - this.trap.size[axis];
            this.currentLookAhead[axis] = -this.lookAhead[axis];
        }

        if(axis === 'x' && flip) {
            // Reverse the affects of the look ahead/trap if the player is looking to the left
            this.currentLookAhead[axis] = -this.currentLookAhead[axis];
            this.trap.pos[axis] -= this.trap.size[axis] * 2;
        }

        return (
            this.pos[axis] - (
                this.pos[axis] - this.trap.pos[axis] + this.offset[axis]
                + this.currentLookAhead[axis]
            ) * ig.system.tick * this.damping + this.shake[axis]
        ).limit( 0, this.max[axis] );
    },


    calculatePosition: function( axis, pos) {
        if( this.entity ) {
            // Account for the current position of the camera
            return pos - this.pos[axis];
        }

        // No entity being tracked, the camera is fixed.
        // Just translate our position by accounting for the camera position
        return (pos - ig.game.screen[axis]).limit( 0, this.max[axis] );
    },


    draw: function() {
        if( this.debug ) {
            ig.system.context.fillStyle = 'rgba(255,0,255,0.3)';
            ig.system.context.fillRect(
                (this.trap.pos.x - this.pos.x) * ig.system.scale,
                (this.trap.pos.y - this.pos.y) * ig.system.scale,
                this.trap.size.x * ig.system.scale,
                this.trap.size.y * ig.system.scale
            );
        }
    },

    resetShake: function() {
      this.shake.x = 0;
      this.shake.y = 0;
    }
  });
})
