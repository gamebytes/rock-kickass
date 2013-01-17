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

      ig.game.camera.move(80, 350);
    },

    acts: [
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
          text: '*sigh* Of course I did. What would \nyou have made it with? Titanium!?'
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
          text: 'This again?! He\'s totally different!'
        }
      , {
          entity: 'Higgs',
          text: 'He\'s got spikey hair and sweet sunglasses!'
        }
      , {
          entity: 'center',
          text: '**Please Don\'t Sue Us Capcom**'
        }
      , {
          entity: 'Boson',
          text: 'Anyway, let\'s run him \nthrough the training course.',
        }
      , {
          entity: 'center',
          text: '** go through the door to the right **'
      }
    ]
  });
});
