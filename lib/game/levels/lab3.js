ig.module( 'game.levels.lab3' )
.requires('impact.image','game.entities.player','game.entities.levelexit','game.entities.levelexit','game.entities.enemy-zombie','game.entities.enemy-zombie','game.entities.enemy-turret')
.defines(function(){
LevelLab3=/*JSON[*/{"entities":[{"type":"EntityPlayer","x":184,"y":528},{"type":"EntityLevelexit","x":96,"y":512,"settings":{"level":"lab2","size":{"x":64,"y":64}}},{"type":"EntityLevelexit","x":1088,"y":512,"settings":{"level":"lobby1","size":{"x":64,"y":64}}},{"type":"EntityEnemyZombie","x":688,"y":558},{"type":"EntityEnemyZombie","x":736,"y":558},{"type":"EntityEnemyTurret","x":952,"y":532}],"layer":[{"name":"main","width":20,"height":10,"linkWithCollision":false,"visible":1,"tilesetName":"media/lab-tiles.png","repeat":false,"preRender":false,"distance":"1","tilesize":64,"foreground":false,"data":[[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],[9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11]]},{"name":"collision","width":20,"height":10,"linkWithCollision":false,"visible":1,"tilesetName":"","repeat":false,"preRender":false,"distance":1,"tilesize":64,"foreground":false,"data":[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]},{"name":"decoration","width":20,"height":10,"linkWithCollision":false,"visible":1,"tilesetName":"media/lab-tiles.png","repeat":false,"preRender":false,"distance":"1","tilesize":64,"foreground":false,"data":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}]}/*]JSON*/;
LevelLab3Resources=[new ig.Image('media/lab-tiles.png'), new ig.Image('media/lab-tiles.png')];
});