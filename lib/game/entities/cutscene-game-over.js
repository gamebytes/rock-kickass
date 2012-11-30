ig.module(
  'game.entities.cutscene-game-over'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutsceneGameOver = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    start: function() {
      this.parent();

      ig.game.camera.move(80, 300);
    },

    end: function() {
      this.parent();

      ig.game.loadLevel( LevelLab2 );
    },

    text: [
      {
        entity: 'center',
        text: '** at the laboratory **'
      }
      , {
          entity: 'Boson',
          text: 'I told you we should\nhave used plutonium!',
          effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
        }
      , {
          entity: 'Higgs',
          text: 'But I got a good\ndeal on thorium!',
          effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
        }
      , {
          entity: 'center',
          text: '** GAME OVER **',
          effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
        }
    ]
  });
});
