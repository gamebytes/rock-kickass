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
      { entity: 'Basher', text: '** ARGHHHHHHHH!!! **' }
      , { entity: 'Basher', text: '** I\'m going to \nrun you down!!! **' }
    ],

    onstart: function () {
      this.boss = ig.game.getEntityByName('Basher');

      this.boss.enabled = false;

      ig.game.camera.move(this.boss.pos.x - ig.system.width / 2, this.boss.pos.y - ig.system.height / 2);

      if(window['_gaq'])
        _gaq.push(['_trackEvent', 'Game Actions', 'Basher', 'Player Reached Basher']);
    },

    oncomplete: function () {
      this.boss.enabled = true;
    }
  });
});