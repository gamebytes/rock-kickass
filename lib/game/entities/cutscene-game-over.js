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

    init: function(x,y,settings) {
      this.parent(x, y, settings);

      this.text = this.textOptions.random();
    },

    start: function() {
      this.parent();

      ig.game.camera.move(80, 300);

      if(window['_gaq'])
        _gaq.push(['_trackEvent', 'Game Actions', 'Life and Death', 'Game Over']);
    },

    end: function() {
      this.parent();

      ig.game.playerController.reset();
      ig.game.loadLevel( ig.game.lastLevel );
    },

    text: null,

    textOptions: [
      [
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
      ],
      [
        {
          entity: 'center',
          text: '** at the laboratory **'
        }
        , {
            entity: 'Boson',
            text: 'Someone call MegaMa...',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
        , {
            entity: 'Higgs',
            text: 'Fine! What\'s his phone number???',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
        , {
            entity: 'center',
            text: '** GAME OVER **',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
      ],
      [
        {
          entity: 'center',
          text: '** at the laboratory **'
        }
        , {
            entity: 'Boson',
            text: 'You said he was invincible!!!',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
        , {
            entity: 'Higgs',
            text: 'No! I said he was irresistible...\nTo the ladies!!!',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
        , {
            entity: 'center',
            text: '** GAME OVER **',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
      ],
      [
        {
          entity: 'center',
          text: '** at the laboratory **'
        }
        , {
            entity: 'Boson',
            text: 'How many more shells\ndo we have!?!?!?',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
        , {
            entity: 'Higgs',
            text: 'That was the last one!\nLet\'s get out of here!',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
        , {
            entity: 'Boson',
            text: 'But who will do\nthe science!?!?!?',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
        , {
            entity: 'center',
            text: '** GAME OVER **',
            effects: ['GameOverEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
          }
      ]

    ]
  });
});
