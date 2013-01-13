ig.module(
  'fragcastle.design.animation-preview'
)
.requires(
  'dom.ready',
  'impact.game',
  'weltmeister.evented-input',
  'weltmeister.config',
  'weltmeister.edit-map',
  'weltmeister.edit-entities',
  'weltmeister.select-file-dropdown',
  'weltmeister.modal-dialogs',
  'weltmeister.undo'
)
.defines(function(){ "use strict";
  wm.plugins = wm.plugins || {};
  wm.plugins.AnimationPreview = ig.Class.extend( {
    previewDialog: null,
    noop: function() {},

    init: function() {
      this.previewDialog = new wm.plugins.ModalDialogAnimationPreview( 'Preview Animation' );
      this.previewDialog.onOk = this.noop;

      this.$previewButton = $('<input />', {
        type: "button",
        id: "previewSpriteAnim",
        value: "Preview Sprite",
        "class": "button"
      } )
      .on('click', this.showPreviewDialog.bind(this) )
      .insertBefore('#levelSave');
    },

    showPreviewDialog: function() {
      this.previewDialog.setPath('media/');
      this.previewDialog.open();
    }
  } );

  wm.plugins.ModalDialogAnimationPreview = wm.ModalDialog.extend({
    pathDropdown: null,
    pathInput: null,
    fileType: 'images',
    chooseImageDialog: null,
    duration: 10000,
    zoom: 1.5,

    init: function( text, okText, type, duration ) {
      this.fileType = type || '';
      this.parent( text, (okText || 'I\'m Done'), 'Refresh Sprite' );
      this.duration = duration || this.duration;

      this.resetAnim();
    },


    setPath: function( path ) {
      var dir = path.replace(/\/[^\/]*$/, '');
      this.$pathInput.val( path );
      this.pathDropdown.loadDir( dir );
    },


    initDialog: function() {
      var parent = this;

      this.parent();
      this.$pathInput = $('<input/>', {'type': 'text', 'class': 'modalDialogPath'} );
      this.$zoomInput = $('<input/>', {'type': 'text', 'class': 'number'} );
      this.$durationInput = $('<input/>', {'type': 'text', 'class': 'number'} );
      this.$body = $('<div />', { 'class': 'modalPreviewBody' });
      this.$spriteImageContainer = $('<div />', { style: 'overflow: auto; width: 100%;'} );
      this.$spriteImage = $('<img />').appendTo(this.$spriteImageContainer);
      this.$animContainer = $('<div />', { style: 'overflow: hidden;'} );
      this.$anim = $('<img />', { style: 'position: relative;' } ).appendTo(this.$animContainer);
      this.$body
            .append(this.$spriteImageContainer)
            .append('<br />')
            .append('<label>Sprite File:</label>')
            .append(this.$pathInput)
            .append('<br />')
            .append('<label>Zoom Level:</label>')
            .append(this.$zoomInput)
            .append('<br />')
            .append('<label>Animation Duration (ms):</label>')
            .append(this.$durationInput)
            .append('<br />')
            .append(this.$animContainer);

      this.buttonDiv.before( this.$body );
      this.pathDropdown = new wm.SelectFileDropdown( this.$pathInput, wm.config.api.browse, this.fileType );

      this.$zoomInput.val( this.zoom ).on('keyup', function() {
        parent.zoom = isNaN( $(this).val() * 1 ) ? parent.zoom : ($(this).val() * 1);
        parent.resetAnim();
      } );
      this.$durationInput.val( this.duration ).on('keyup', function() {
        parent.duration = isNaN( $(this).val() * 1 ) ? parent.duration : ($(this).val() * 1);
        parent.resetAnim();
      } );


      this.$pathInput.on('blur', function(){
        parent.$spriteImage
              .attr( 'src', $(this).val() )
              .one('load', function(){
                parent.resetAnim();
              });
      });

      // fix z-index bug with selectFileDialog

      $('.selectFileDialog').css('z-index', '100');
    },

    resetAnim: function() {
      clearTimeout(this.animation);
      this.currentFrame = -1;

      if( this.$spriteImage.attr('src') ) {
        var meta = this.meta();

        this.$animContainer
            .attr('style', 'border: 1px solid #eee; overflow: hidden;')
            .height( meta.frameOffset * this.zoom )
            .width( meta.frameOffset * this.zoom );
        this.$anim
              .attr('src', meta.imagePath)
              .height( this.$spriteImage.height() * this.zoom )
              .width( this.$spriteImage.width() * this.zoom );

        this.animate();
      }
    },

    meta: function() {
      var dimen = {
                  height: this.$spriteImage.height(),
                  width: this.$spriteImage.width()
                },
          numFrames = dimen.height > dimen.width ?
                      dimen.height/dimen.width :
                      dimen.width/dimen.height;
      return {
        imagePath: this.$spriteImage.attr('src'),
        dimen: dimen,
        numFrames: numFrames,
        frameOffset: dimen.height > dimen.width ? dimen.width : dimen.height,
        delay: this.duration/numFrames
      }
    },

    animate: function() {
      var parent = this,
          meta = this.meta();

      // read the current frame and increment it or set it to 0
      this.currentFrame = ++this.currentFrame > (meta.numFrames - 1) ? 0 : this.currentFrame;

      if( this.$anim.get(0).complete ) {
        this.$anim.css( 'left', ( ( -1 * meta.frameOffset * this.zoom) * this.currentFrame) + 'px' );
      }

      // animate the next frame
      this.animation = setTimeout( function(){
        parent.animate();
      }, meta.delay );
    },

    clickOk: function() {
      this.close();
    },

    clickCancel: function() {
      var src = this.$spriteImage.attr('src'),
          now = new Date();
      if( src ) {
        src += "?time=" + now.getTime();
        this.$spriteImage.attr('src', src);
        this.resetAnim();
      }
    }
  });

  // RUN ON LOAD
  $(function() {
    var animationPreviewPlugin = new wm.plugins.AnimationPreview();
  });
});
