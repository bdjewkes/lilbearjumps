/// <reference path="../tsDefinitions/phaser.d.ts" />
  
const GAME_MODE_PLAY = "play";

const BEAR_KEY = 'bear';
const PLATFORM_KEY = 'platform';

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 600;

const JUMP_VELOCITY = -500;

class BearJump
{
    bear: Phaser.Sprite;
    platforms: Phaser.Group;
    game: Phaser.Game;

    yOrigin: number = 0;
    yChange: number = 0;
    cameraYMin: number = 9999;
    platformYMin: number = 9999;

    constructor(game: Phaser.Game){
        this.game = game;
    }

    preload = () => {     
        this.game.load.image(BEAR_KEY, './assets/bear.gif');
        this.game.load.image(PLATFORM_KEY, './assets/platform.png');
    } 

    create = () => {
        this.game.stage.backgroundColor = '#6bf';
        
        this.game.world.setBounds(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bear = this.makeBear(this.game.world.centerX, this.game.world.height - 50);
        
        this.platforms = this.game.add.physicsGroup()
        this.platforms.enableBody = true;
        this.platforms.createMultiple(10, PLATFORM_KEY);
        this.game.physics.enable(this.platforms, Phaser.Physics.ARCADE);
    

        for(var i = 0; i < 9; i++) {
           this.makePlatform(this.game.rnd.between(100, this.game.world.width - 150), this.game.world.height - 100 - (100 * i), 0.4);
        }
        this.game.camera.bounds = null;
    }

    makeBear = (x: number, y: number) => {
        let bear = this.game.add.sprite(x, y, BEAR_KEY);
        bear.scale.set(0.05, 0.05);
        bear.anchor.set(0.5, 0.5);
    
        this.yOrigin = bear.y;
        this.yChange = 0;
        
        this.game.physics.enable(bear,Phaser.Physics.ARCADE); 

        let bearBody: Phaser.Physics.Arcade.Body = bear.body;
        bearBody.gravity.y = 600;
        bearBody.collideWorldBounds = false;
        bearBody.allowGravity = true;
        bearBody.checkCollision.up = false;
        bearBody.checkCollision.left = false;
        bearBody.checkCollision.right = false;
        bearBody.checkCollision.down = true;

        bearBody.velocity.y = -600;

        return bear;
    }

    makePlatform = (x: number, y: number, scaleWidth: number) => {
        let platform = this.platforms.getFirstDead();
        platform.reset(x, y);
        platform.scale.set(scaleWidth, 0.1);
        platform.anchor.set(0.5, 0.5);
        platform.body.immovable = true;
        platform.body.checkCollision.up = true;

        return platform;
    }

    bearMove = () => {
        var speed = 500;
        var pointer = this.game.input.activePointer;
        var angle = this.game.physics.arcade.angleToPointer(this.bear, pointer);

        this.bear.body.velocity.x = Math.cos(angle) * speed;

        
        this.game.world.wrap(this.bear, 0, true, true, false);
        // track the maximum amount that the hero has travelled
        this.yChange = Math.max(this.yChange, Math.abs(this.bear.y - this.yOrigin));

        this.bear.body.gravity.y = 600 - (this.yChange/50);

        //console.log("bear Y " + this.bear.y +  " yChange: " + this.yChange + " yOrigin: " + this.yOrigin + " yCamera: " + this.cameraYMin)


        if(this.bear.y > this.cameraYMin + this.game.height + 500) {
            this.game.state.restart(true, false);
            
        }
    }

    update(){
    
        this.game.world.setBounds(0, -this.yChange, this.game.world.width, this.game.height + this.yChange );

        this.cameraYMin = Math.min(this.cameraYMin, this.bear.y - this.game.height + 400);
        this.game.camera.y = this.cameraYMin;

        this.game.physics.arcade.collide(this.bear, this.platforms, (bear, platform) => 
        {
            if(bear.body.touching.down) 
            {
                bear.body.velocity.y = JUMP_VELOCITY;
            }
        }, null, this);

        this.bearMove();
        this.platforms.forEachAlive((elem)=>{
            this.platformYMin = Math.min(this.platformYMin, elem.y);
            if(elem.y > this.game.camera.y + this.game.height) {
                //console.log("Killing platform at " + elem.y + " and creating platform at " + createHeight + " The game height is " + this.game.height + " PlatformYMin is " + platformYMin);
                elem.kill();
                this.makePlatform(this.game.rnd.between(100, this.game.world.width - 100 ), this.platformYMin - 150, 0.2);
            }
        }, this );
    }

    shutdown = () => {
        console.log("shutdown");
    // reset everything, or the world will be messed up
        this.game.world.setBounds( 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
        this.bear.destroy();
        this.bear = null;
        this.platforms.destroy();
        this.platforms = null;
        this.cameraYMin = 9999;
        this.yOrigin = 0;
        this.platformYMin = 9999;
  }



    render = () => {
        this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
      //  this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);

        this.game.debug.text(this.bear.body.gravity.y ,32,32 )
       // this.game.debug.cameraInfo(this.game.camera, 32, 32);
       // this.game.debug.spriteInfo(this.bear, 32,200);
    }
}
    

window.onload = () => {
    var game = new Phaser.Game(VIEW_WIDTH, VIEW_HEIGHT, Phaser.CANVAS, '' );
    game.state.add(GAME_MODE_PLAY, new BearJump(game));
    game.state.start(GAME_MODE_PLAY);
}