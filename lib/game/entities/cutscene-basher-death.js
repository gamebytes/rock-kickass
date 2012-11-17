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
      { entity: 'boss', text: 'Nooooo!!!!!' },
      { entity: 'boss', text: '** Basher dies! **' },
      { entity: 'boss', text: '** Maybe you can scavenge his parts and source code! **' },
    ],

    onstart: function () {
    },

    oncomplete: function () {
      ig.game.spawnEntity( EntityEffectMerge, this.pos.x, this.pos.y, { colorOffset: 1 });
    }
  });
});
