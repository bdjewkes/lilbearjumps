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
var GAME_MODE_PLAY = "play";
var BEAR_KEY = 'bear';
var PLATFORM_KEY = 'platform';
var VIEW_WIDTH = 600;
var VIEW_HEIGHT = 600;
var JUMP_VELOCITY = -500;
var BearJump = (function () {
    function BearJump(game) {
        var _this = this;
        this.yOrigin = 0;
        this.yChange = 0;
        this.cameraYMin = 9999;
        this.platformYMin = 9999;
        this.preload = function () {
            _this.game.load.image(BEAR_KEY, './assets/bear.gif');
            _this.game.load.image(PLATFORM_KEY, './assets/platform.png');
        };
        this.create = function () {
            _this.game.stage.backgroundColor = '#6bf';
            _this.game.world.setBounds(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
            _this.game.physics.startSystem(Phaser.Physics.ARCADE);
            _this.bear = _this.makeBear(_this.game.world.centerX, _this.game.world.height - 50);
            _this.platforms = _this.game.add.group();
            _this.platforms.enableBody = true;
            _this.platforms.createMultiple(10, PLATFORM_KEY);
            for (var i = 0; i < 9; i++) {
                _this.makePlatform(_this.game.world.centerX, _this.game.world.height - 100 - (100 * i), 0.5);
            }
            _this.game.camera.bounds = null;
        };
        this.makeBear = function (x, y) {
            var bear = _this.game.add.sprite(x, y, BEAR_KEY);
            bear.scale.set(0.05, 0.05);
            bear.anchor.set(0.5, 0.5);
            _this.yOrigin = bear.y;
            _this.yChange = 0;
            _this.game.physics.enable(bear, Phaser.Physics.ARCADE);
            var bearBody = bear.body;
            bearBody.gravity.y = 600;
            bearBody.collideWorldBounds = false;
            bearBody.allowGravity = true;
            bearBody.immovable = true;
            bearBody.checkCollision.up = false;
            bearBody.checkCollision.left = false;
            bearBody.checkCollision.right = false;
            bearBody.checkCollision.down = true;
            bearBody.velocity.y = -600;
            return bear;
        };
        this.makePlatform = function (x, y, scaleWidth) {
            var platform = _this.platforms.getFirstDead();
            platform.reset(x, y);
            platform.scale.set(scaleWidth, 0.2);
            platform.anchor.set(0.5, 0.5);
            platform.body.immovable = true;
            return platform;
        };
        this.bearMove = function () {
            var speed = 500;
            var pointer = _this.game.input.activePointer;
            var angle = _this.game.physics.arcade.angleToPointer(_this.bear, pointer);
            _this.bear.body.velocity.x = Math.cos(angle) * speed;
            _this.game.world.wrap(_this.bear, 0, true, true, false);
            // track the maximum amount that the hero has travelled
            _this.yChange = Math.max(_this.yChange, Math.abs(_this.bear.y - _this.yOrigin));
            //console.log("bear Y " + this.bear.y +  " yChange: " + this.yChange + " yOrigin: " + this.yOrigin + " yCamera: " + this.cameraYMin)
            if (_this.bear.y > _this.cameraYMin + _this.game.height + 500) {
                _this.game.state.restart(true, false);
            }
        };
        this.shutdown = function () {
            console.log("shutdown");
            // reset everything, or the world will be messed up
            _this.game.world.setBounds(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
            _this.bear.destroy();
            _this.bear = null;
            _this.platforms.destroy();
            _this.platforms = null;
            _this.cameraYMin = 9999;
        };
        this.render = function () {
            _this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
            //  this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
            _this.game.debug.cameraInfo(_this.game.camera, 32, 32);
            _this.game.debug.spriteInfo(_this.bear, 32, 200);
        };
        this.game = game;
    }
    BearJump.prototype.update = function () {
        var _this = this;
        this.game.world.setBounds(0, -this.yChange, this.game.world.width, this.game.height + this.yChange);
        this.cameraYMin = Math.min(this.cameraYMin, this.bear.y - this.game.height + 130);
        this.game.camera.y = this.cameraYMin;
        this.game.physics.arcade.collide(this.bear, this.platforms, function (bear, platform) {
            var bearBody = bear.body;
            if (bearBody.checkCollision.down) {
                bearBody.velocity.y = JUMP_VELOCITY;
            }
        }, null, this);
        this.bearMove();
        this.platforms.forEachAlive(function (elem) {
            _this.platformYMin = Math.min(_this.platformYMin, elem.y);
            if (elem.y > _this.game.camera.y + _this.game.height) {
                //console.log("Killing platform at " + elem.y + " and creating platform at " + createHeight + " The game height is " + this.game.height + " PlatformYMin is " + platformYMin);
                elem.kill();
                _this.makePlatform(_this.game.world.centerX, _this.platformYMin - 100, 0.5);
            }
        }, this);
    };
    return BearJump;
}());
window.onload = function () {
    var game = new Phaser.Game(VIEW_WIDTH, VIEW_HEIGHT, Phaser.CANVAS, '');
    game.state.add(GAME_MODE_PLAY, new BearJump(game));
    game.state.start(GAME_MODE_PLAY);
};


/***/ })
/******/ ]);