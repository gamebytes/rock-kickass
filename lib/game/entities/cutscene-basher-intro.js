ig.module(
  'game.entities.cutscene-basher-intro'
)
.requires(
  'impact.entity',
  'game.entities.cutscene'
)
.defines(function() {
  EntityCutsceneBasherIntro = EntityCutscene.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    // animations need to be specified here so that they can be
    // preloaded and cached.
    animationIntro: new ig.AnimationSheet( 'media/basher-intro-animation.png', 500, 320 ),

    boss: null,

    acts: [
      {
        animation: {
          name: 'Intro', // name of the animation property on _this_ EntityCutscene
          frames: [0,1,2,3,4,5,6,7,8,8,8,9,9,9,10,10,10,11,11,11,12,12,12,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],
          frameDuration: 0.04
        }
      }
      , { entity: 'Basher', text: '** ARGHHHHHHHH!!! **' }
      , { entity: 'Basher', text: '** I\'m going to \nrun you down!!! **' }
    ],

    onstart: function () {
      this.boss = ig.game.getEntityByName('Basher');

      this.boss.enabled = false;

      ig.game.camera.move(this.boss.pos.x - ig.system.width / 2, this.boss.pos.y - ig.system.height / 2);

      if(window['_gaq'])
        _gaq.push(['_trackEvent', 'Game Actions', 'Basher', 'Player Reached Basher']);
    },

    oncomplete: function () {
      this.boss.enabled = true;
    }
  });
});
