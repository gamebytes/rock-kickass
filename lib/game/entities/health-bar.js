ig.module(
  'game.entities.health-bar'
)
.requires(
  'impact.game',
  'impact.entity',
  'impact.background-map'
)
.defines(function() {
  EntityHealthBar = ig.Entity.extend({
    size: { x: 32, y: 5 },
 
    animSheet: new ig.AnimationSheet( 'media/health-bar.png', 32, 5 ),

    entity: null,
 
    init: function( x, y, settings ) {
      this.addAnim( '0', 1, [10] );
      this.addAnim( '1', 1, [9] );
      this.addAnim( '2', 1, [8] );
      this.addAnim( '3', 1, [7] );
      this.addAnim( '4', 1, [6] );
      this.addAnim( '5', 1, [5] );
      this.addAnim( '6', 1, [4] );
      this.addAnim( '7', 1, [3] );
      this.addAnim( '8', 5, [2] );
      this.addAnim( '9', 1, [1] );
      this.addAnim( '10', 1, [0] );

      this.parent( x, y, settings );
      this.zIndex = 6;
    },
 
    update: function() {
      this.pos.x = this.entity.pos.x + (this.entity.size.x - 32) / 2;
      this.pos.y = this.entity.pos.y - 5;

      if (this.entity.health <= 0 ) {
        this.kill();
      } else {
        this.currentAnim = this.anims[Math.ceil(this.entity.health / this.entity.maxHealth * 10)];
      }
    }
  });
});