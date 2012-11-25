ig.module(
  'game.entities.cutscene-intro'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutsceneIntro = EntityCutscene.extend({
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
        text: '** at the laboratory **'
      }
      , {
          entity: 'Higgs',
          text: 'Well, it looks like he\'s operational.'
        }
      , {
          entity: 'Boson',
          text: 'Yes... Higgs, did you have to make \nhis gun out of gold?'
        }
      , {
          entity: 'Higgs',
          text: '*sigh* Of course I did. What would \nyou have made it with? Metal!?'
        }
      , {
          entity: 'Boson',
          text: 'Ugh, ok... let\'s make \nsure his systems are all online.'
        }
      , {
          entity: 'Rock',
          text: 'Rock Kickass \nv1.0 reporting!'
        }
      , {
          entity: 'Boson',
          text: 'You named him\n "Rock Kickass"?!?'
        }
      , {
          entity: 'Higgs',
          text: 'Didn\'t you \nsee the title screen?'
        }
      , {
          entity: 'Boson',
          text: '...Ya know... he looks \nan awful lot like MegaMa...'
        }
      , {
          entity: 'Higgs',
          text: 'This again?! He\'s totally different!\n He\'s got spikey hair and bitchin\' sunglasses!'
        }
      , {
          entity: 'center',
          text: '**Please Don\'t Sue Us Capcom**'
        }
      , {
          entity: 'Boson',
          text: '...',
          effect: 'EntityInstantEarthquake'
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
