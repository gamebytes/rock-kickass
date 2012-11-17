ig.module(
  'game.entities.cutscene-basher-intro'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutsceneBasherIntro = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    boss: null,

    text: [
      { entity: 'center', text: '** ARGHHHHHHHH!!! **' }
      , { entity: 'center', text: '** I\'m going to run you down!!! **' }
    ],

    onstart: function () {
      console.log('Start');

      this.boss = ig.game.getEntityByName('boss');

      this.boss.enabled = false;
      
      ig.game.camera.move(this.boss.pos.x - ig.system.width / 2, this.boss.pos.y - ig.system.height / 2);
    },

    oncomplete: function () {
      console.log('Complete');

      this.boss.enabled = true;
    }
  });
});
