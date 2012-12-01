ig.module(
  'game.entities.cutscene-basher-death'
)
.requires(
  'impact.entity',
  'game.entities.cutscene',
  'game.entities.effect-merge'
)
.defines(function() {
  EntityCutsceneBasherDeath = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    text: [
      { entity: 'this', text: 'Nooooo!!!!!' },
      { entity: 'center', text: '** You defeated Basher! **' }
    ],

    onstart: function () {
      if(window['_gaq'])
        _gaq.push(['_trackEvent', 'Game Actions', 'Basher', 'Player Defeated Basher']);
    },

    oncomplete: function () {
      ig.game.loadLevelDeferred( ig.global['LevelCredits'] );
    }
  });
});
