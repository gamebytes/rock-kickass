ig.module(
  'game.entities.cutscene-post-intro'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutscenePostIntro = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    start: function() {
      this.parent();

      ig.game.camera.move(80, 300);
    },

    text: [
      {
        entity: 'center',
        text: '** back in the laboratory **'
      }
      , {
          entity: 'Higgs',
          text: 'Excellent, I told you \nhe would get through!'
        }
      , {
          entity: 'Boson',
          text: 'Yes... seems like he\'s \nat 100% operational capacity.'
        }
      , {
          entity: 'Boson',
          text: 'I still think he looks \na lot like Mega...'
        }
      , {
          entity: 'Higgs',
          text: 'Dude! Stop with that! \nYou\'re going to get us in trouble!'
        }
      , {
          entity: 'center',
          text: '**Pretty, Pretty Please Don\'t Sue Us Capcom**'
        }
      , {
          entity: 'Boson',
          text: 'Alright, shut him \ndown and run some diagnos...'
        }
      , {
          entity: 'Higgs',
          text: '...',
          effects: ['IntroEarthquake', 'IntroDebris1', 'IntroDebris2', 'IntroDebris3', 'IntroDebris4', 'IntroDebris5', 'IntroDebris6']
        }
      , {
          entity: 'Higgs',
          text: 'What the hell was that!?!'
      }, {
          entity: 'Boson',
          text: 'We\'re under attack! \nRock! Get out there!'
      }
    ]
  });
});
