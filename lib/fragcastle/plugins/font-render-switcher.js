ig.module(
  'fragcastle.plugins.font-render-switcher'
)
.requires(
  'impact.impact'
)
.defines(function(){
  FontRenderSwitcher = ig.Class.extend({
    align: {
      left: ig.ua.mobile ? 'left' : ig.Font.ALIGN.LEFT,
      center: ig.ua.mobile ? 'center' : ig.Font.ALIGN.CENTER,
      right: ig.ua.mobile ? 'right' : ig.Font.ALIGN.CENTER
    }
  });

  ig.fontRenderSwitcher = new FontRenderSwitcher();
});