/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
var Game = (function () {
    function Game() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'Lil Bear Jump', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
    }
    Game.prototype.preload = function () {
        this.game.load.image('bear', 'assets/bear.gif');
    };
    Game.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bear = this.game.add.sprite(0, 0, 'bear');
        this.bear.anchor.setTo(0.5, 0.5);
        this.bear.scale.x = 0.05;
        this.bear.scale.y = 0.05;
        this.game.physics.enable(this.bear, Phaser.Physics.ARCADE);
        this.bear.body.gravity.set(0, 700);
        //  Tell it we don't want physics to manage the rotation
        this.bear.body.allowRotation = false;
        // bear only jumps when falling
        this.bear.body.checkCollision.up = false;
        this.platform = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, null);
        this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
        this.platform.body.setSize(50, 50, 0, 0); // set the size of the rectangle
        this.game.physics.enable(this.platform, Phaser.Physics.ARCADE);
        this.platform.body.immovable = true;
        this.platform.anchor.setTo(0.5, 0.5);
    };
    Game.prototype.restart = function () {
    };
    Game.prototype.jump = function (body) {
        body.velocity.y = -700;
    };
    Game.prototype.update = function () {
        var speed = 500;
        var pointer = this.game.input.activePointer;
        var angle = this.game.physics.arcade.angleToPointer(this.bear, pointer);
        this.bear.body.velocity.x = Math.cos(angle) * speed;
        this.game.physics.arcade.collide(this.bear, this.platform, this.collisionHandler, null, this);
    };
    Game.prototype.render = function () {
        this.game.debug.spriteInfo(this.platform, 32, 32);
    };
    Game.prototype.collisionHandler = function (obj1, obj2) {
        console.log("ping");
        if (obj1.body.touching.down && obj1.body.velocity.y >= 0) {
            this.jump(this.bear.body);
        }
    };
    return Game;
}());
window.onload = function () {
    var game = new Game();
};


/***/ })
/******/ ]);