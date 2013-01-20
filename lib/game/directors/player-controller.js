ig.module(
    'game.directors.player-controller'
)
.requires(
    'impact.impact',
    'game.weapons.pistol',
    'game.weapons.rocket-launcher'
)
.defines(function(){
  ig.PlayerController = ig.Class.extend({
    lives: 3,
    score: 0,
    currentLevel: 0,
    allWeapons: [],
    weapons: [],
    activeWeaponIndex: 0,
    health: 100,
    weaponXps: [],

    nextWeapon: function() {
      this.activeWeaponIndex++;
      if(this.activeWeaponIndex >= this.weapons.length) {
        this.activeWeaponIndex = 0;
      }
      return this.weapons[this.activeWeaponIndex];
    },
    addWeapon: function(weapon, ammo) {
      if(this.weapons.length > 0) {
        for (var i = this.weapons.length - 1; i >= 0; i--) {
          if( this.weapons[i].name === weapon.name ) {
            return;
          }
        };
      }

      this.weapons.push(weapon);

      this.activeWeaponIndex = this.weapons.length - 1;

      if(window['_gaq'])
        _gaq.push(['_trackEvent', 'Game Actions', 'Weapons', 'Weapon Unlocked ' + weapon.name]);
    },

    init: function() {
      this.addWeapon( new WeaponPistol(), -1 );
      this.addWeapon( new WeaponPea(), -1 );
      this.addWeapon( new WeaponGrenade(), -1 );
      this.addWeapon( new WeaponShotgun(), -1 );
      this.addWeapon( new WeaponRocketLauncher(), -1 );
      this.addWeapon( new WeaponBfg(), -1 );
      this.addWeapon( new WeaponBeam(), -1 );
      
      this.allWeapons.push(new WeaponPea());
      this.allWeapons.push(new WeaponPistol());
      this.allWeapons.push(new WeaponGrenade());
      this.allWeapons.push(new WeaponShotgun());
      this.allWeapons.push(new WeaponRocketLauncher());
      this.allWeapons.push(new WeaponBfg());
      this.allWeapons.push(new WeaponBeam());
    },

    reset: function () {
      this.lives = 3;
      this.score -= 10000;
      if(window['_gaq'])
        _gaq.push(['_trackEvent', 'Game Actions', 'Life and Death', 'Game Over Reset']);
    },

    getWeaponAnimationOffset: function() {
      return this.weapons[this.activeWeaponIndex].playerAnimOffset;
    },
    getCurrentWeapon: function() {
      return this.weapons[this.activeWeaponIndex];
    },

    addWeaponXp: function( weapon, xp ) {
      for( var i = 0; i < this.weapons.length; i++ ) {
        if( this.weapons[i] === weapon.name ) {
          return;
        }
      }

      var exists = false;

      for( var i = 0; i < this.weaponXps.length; i++ ) {
        if( this.weaponXps[i].name === weapon.name ) {
          var weaponXp = this.weaponXps[i];
          weaponXp.xp += xp;
          exists = true;

          var hasWeapon = false;

          for(var j = -1, l = this.weapons.length; ++j < this.weapons.length; ) {
            var checkWeapon = this.weapons[j];
            if( checkWeapon.name === weapon.name ) {
              hasWeapon = true;
              break;
            }
          }

          if( weaponXp.xp >= 100 && !hasWeapon ) {
            this.addWeapon( weapon, -1);
            this.weaponXps.splice( i, 1 );

            var player = ig.game.player;

            ig.game.spawnEntity( EffectWeaponAcquired, player.pos.x, player.pos.y, { weaponName: weapon.displayName } );
          }
        }
      }

      if( !exists ) {
        this.weaponXps.push( { name: weapon.name, displayName: weapon.displayName, xp: xp } );
      }
    }
  });
});
