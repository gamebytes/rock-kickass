ig.module(
  'game.entities.cutscene-credits'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutsceneCredits = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    start: function() {
      this.parent();
      ig.game.camera.move(80, 300);
    },

    oncomplete: function() {
      // cheap way to reload the game
      window.location.href = window.location.href;
    },

    acts: [
      {
        entity: 'center',
        text: '** Thanks for playing **'
      }
      , {
        entity: 'center',
        text: '** Rock Kickass **'
      }
      , {
        entity: 'center',
        text: '** A Frag Castle Games joint **'
      }
      , {
          entity: 'Higgs',
          text: 'Game Programming: John Bubriski \n& Jared Barboza'
        }
      , {
          entity: 'Boson',
          text: 'Level Design: John Bubriski'
        }
      , {
          entity: 'Higgs',
          text: 'Cutscene Engine: John Bubriski'
        }
      , {
          entity: 'Boson',
          text: 'Artwork & SoundFX: Jared Barboza'
        }
      , {
          entity: 'Higgs',
          text: 'Soundtrack: "Resistor Anthems" by Erik Skiff\nhttp://ericskiff.com/music/'
        }
      , {
          entity: 'center',
          text: '** Thanks for playing! **'
        }
      , {
          entity: 'center',
          text: '** fin **'
        }
    ]
  });
});
