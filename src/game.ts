/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

const BEAR_KEY = 'bear';
const PLATFORM_KEY = 'platform';

class BearJump
{



    bear: Phaser.Sprite;
    platform: Phaser.Sprite;
    game: Phaser.Game;

    constructor(){
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'Lil Bear Jump',{
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }

    preload(){     
        this.game.load.image(BEAR_KEY, './assets/bear.gif');
        this.game.load.image(PLATFORM_KEY, './assets/platform.png');
    } 

    create(){
        this.bear = this.game.add.sprite(this.game.world.centerX, 0, BEAR_KEY);
        this.bear.scale.set(0.05, 0.05);
        this.bear.anchor.set(0.5, 0.5);

        this.platform = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, PLATFORM_KEY);
        this.platform.scale.set(0.6, 0.2);
        this.platform.anchor.set(0.5, 0.5);

        
         this.game.physics.startSystem(Phaser.Physics.ARCADE);
         this.game.physics.enable(this.bear,Phaser.Physics.ARCADE); 
         this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
         this.game.physics.arcade.gravity.y = 600;

         this.platform.body.immovable = true;
         this.platform.body.moves = false;
    }

    jumpHandler(jumper, body2){
        jumper.body.velocity.y = - 1000
    }

    update(){
        let jumpCallback = (a, b) => ;
        this.game.physics.arcade.collide(this.bear, this.platform, BearJump.prototype.jumpHandler, null, this);
    }
}
    

window.onload = () => {
	var game = new BearJump();
}