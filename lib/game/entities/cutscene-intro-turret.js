ig.module(
  'game.entities.cutscene-intro-turret'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutsceneIntroTurret = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    start: function() {
      this.parent();

      ig.game.camera.move(300, 300);
    },

    text: [
      {
          entity: 'Higgs',
          text: 'OK Rock, this is\nthe last training level'
      }
      , {
            entity: 'Higgs',
            text: 'Watch out for\nthe live fire turrets!'
        }
      , {
          entity: 'Boson',
          text: 'Make sure you don\'t screw up!'
        }
      , {
          entity: 'Higgs',
          text: '*sigh* Go easy on him!\nIt\'s his first day!'
        }
      , {
          entity: 'Boson',
          text: 'Please!\nI could do this\ncourse in my sleep.'
        }
      , {
          entity: 'Boson',
          text: '** zzzzzzz **'
        }
      , {
          entity: 'Rock',
          text: '** ... **'
        }
      , {
          entity: 'Higgs',
          text: 'Oh, I almost forgot!'
        }
      , {
          entity: 'Higgs',
          text: 'When you defeat enemies\nyou can merge their source'
        }
      , {
          entity: 'Higgs',
          text: 'Merge enough of their source\nand you can gain new weapons!'
        }
      , {
          entity: 'Higgs',
          text: 'Good luck!'
        }
    ]
  });
});
