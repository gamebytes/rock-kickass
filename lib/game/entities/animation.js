/*
This entity does nothing but draw a series of frames from a sprite sheet.
*/

ig.module(
    'game.entities.animation'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityAnimation = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(128, 28, 230, 0.7)',

        // this entity does not collide with anything, ever
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,

        size: {x: 8, y: 8},

        spriteSheet: null,
        frames: [],
        frameDuration: 0,
        setupDone: false,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.trySetup( settings );
        },

        trySetup: function(settings) {
            if( settings.frames && settings.frameDuration && settings.sprite && settings.frameSizeX && settings.frameSizeY ) {
                this.frames = settings.frames.split(',');

                for (var i = this.frames.length - 1; i >= 0; i--) {
                    this.frames[i] = this.frames[i] * 1;
                };

                this.frameDuration = settings.frameDuration * 1; // make sure its a number
                this.size = this.frameSize = {
                    x: settings.frameSizeX * 1,
                    y: settings.frameSizeY * 1
                };

                // create our spriteSheet object
                this.animSheet = new ig.AnimationSheet( settings.sprite, this.frameSize.x, this.frameSize.y );

                this.addAnim( 'idle', this.frameDuration, this.frames );

                this.currentAnim = this.anims.idle;

                this.setupDone = true;

                this._wmDrawBox = false;
            }
        },

        update: function() {
            this.parent();
        },

        draw: function() {
            this.parent();
        }
    });
});
