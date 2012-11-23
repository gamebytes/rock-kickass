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
      { entity: 'center', text: '** You defeated Basher! **' },
      { entity: 'center', text: '** You scavenge his parts and find some source code! **' },
      { entity: 'center', text: '** Merge his changes! **' },
    ],

    onstart: function () {
    },

    oncomplete: function () {
      ig.game.spawnEntity( EntityEffectMerge, this.pos.x, this.pos.y, { colorOffset: 1 });
    }
  });
});
