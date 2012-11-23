ig.module(
  'game.entities.teleport'
)
.requires(
  'impact.entity'
)
.defines(function() {
  EntityTeleport = ig.Entity.extend({
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    size: {x: 8, y: 8},
    target: null,

    triggeredBy: function( entity, trigger ) {  
      if( entity instanceof EntityPlayer ) {
        if( this.target ) {
          var targetEntity = ig.game.getEntityByName( this.target );
          
          entity.pos.x = targetEntity.pos.x;
          entity.pos.y = targetEntity.pos.y;
        }
      }
    },

    update: function() {}
  });
});
