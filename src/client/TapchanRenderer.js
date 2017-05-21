/**
 * Created by Snippy on 2017-04-28.
 */

const Renderer = require('lance-gg').render.Renderer;
const PIXI = require('pixi.js');
const Utils = require('../common/Utils');

// const Camera = require('./Camera');

const Pacman = require('../common/Pacman');
const Ghost = require('../common/Ghost');
const Wall = require('../common/Wall');

class TapchanRenderer extends Renderer {

    get ASSETPATHS() {
        return {
            pacman:  'assets/pacman.png',
            ghost:   'assets/ghost.png',
            wall:    'assets/wall.png',
            clouds1: 'assets/clouds1.png',
            clouds2: 'assets/clouds2.png',
        }
    }

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.isReady = false;

        this.assetPathPrefix = this.gameEngine.options.assetPathPrefix ? this.gameEngine.options.assetPathPrefix : '';
        /*window.onresize = () => {
            let canvas = document.getElementById('thegame');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };*/

        this.bgPhaseX = 0;
        this.bgPhasey = 0;
        // this.camera = new Camera();
    }

    init() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.stage = new PIXI.Container();
        this.layer1 = new PIXI.Container();
        this.layer2 = new PIXI.Container();

        this.stage.addChild(this.layer1, this.layer2);

        if (document.readyState === 'complete' ||
                document.readyState === 'loaded' ||
                document.readyState === 'interactive') {

            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMLoaded();
            });
        }

        return new Promise( (resolve, reject) => {
            PIXI.loader.add(Object.keys(this.ASSETPATHS).map( (x) => {
                return {
                    name: x,
                    url: this.assetPathPrefix + this.ASSETPATHS[x],
                };
            }))
                .load( () => {
                    this.isReady = true;
                    this.setupStage();
                    this.gameEngine.emit('renderer.ready');

                    resolve();
                })
        });
    }

    onDOMLoaded() {
        console.log('DOMLoaded');
        this.renderer = PIXI.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        $('#pixi').append(this.renderer.view);
    }

    setupStage() {
        window.onresize = () => this.setRendererSize();

        this.lookingAt = { x: 0, y: 0 };
        this.camera = new PIXI.Container();
        this.camera.addChild(this.layer1, this.layer2);


        //background
        this.clouds1 = new PIXI.extras.TilingSprite(PIXI.loader.resources.clouds1.texture, this.viewportWidth, this.viewportHeight);
        this.clouds2 = new PIXI.extras.TilingSprite(PIXI.loader.resources.clouds2.texture, this.viewportWidth, this.viewportHeight);

        this.clouds1.blendMode = PIXI.BLEND_MODES.ADD;
        this.clouds2.blendMode = PIXI.BLEND_MODES.ADD;
        this.clouds2.alpha = .65;

        this.stage.addChild(this.clouds1, this.clouds2);
        // this.stage.addChild(this.camera);

        this.deltaTime = Date.now();

        //debug
        if ('showworldbounds' in Utils.getUrlVars()) {
            let graphics = new PIXI.Graphics();
            graphics.beginFill('0xC21F7B');
            graphics.alpha = .1;
            graphics.drawRect(0, 0, this.worldSettings.width, this.worldSettings.height);
            this.camera.addChild(graphics);
        }
    }

    setRendererSize() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.clouds1.width = this.viewportWidth;
        this.clouds1.height = this.viewportHeight;
        this.clouds2.width = this.viewportWidth;
        this.clouds2.height = this.viewportHeight;

        this.renderer.resize(this.viewportWidth, this.viewportHeight);
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class === Pacman) {

            let pacmanActor = sprite; //save ref to player pacman
            sprite.actor.pacmanSprite.tint = 0xFFFF00; //color player pacman yellow todo should be set by player

            $('#tryAgain, #joinGame').disable().css('opacity', 0);

            this.clientEngine.gameStarted = true;

            //remove tutorial after timeout
            setTimeout( () => {
                $('body').addClass('tutorial');
            }, 10000);

        } else if (objData.class === Ghost) {

            sprite = new PIXI.Sprite(PIXI.loader.resources.Ghost.texture);
            this.sprites[objData.id] = sprite;

            sprite.width = 40;
            sprite.height = 40;

            sprite.anchor.set(.5, .5);

        } else if (objData.class === Wall) {

            sprite = new PIXI.Sprite(PIXI.loader.resources.Wall.texture);
            this.sprites[objData.id] = sprite;

            sprite.width = 40;
            sprite.height = 40;

            sprite.anchor.set(.5, .5);

        }

        sprite.position.set(objData.position.x, objData.position.y);
        this.layer2.addChild(sprite);

        return sprite;
    }

    removeObject(obj) {
        if (this.playerPacman && obj.id === this.playerShip.id) {
            this.playerPacman = null;
        }

        let sprite = this.sprites[obj.id];
        if (sprite.actor) {
            //removal takes time
            sprite.actor.destroy().then( () => {
                console.log('Object#' + obj.id + ' sprite deleted.');
                delete this.sprites[obj.id];
            });
        } else {
            this.sprites[obj.id].destroy();
            delete this.sprites[obj.id];
        }
    }

    centerCamera(targetX, targetY) {
        if (isNaN(targetX) || isNaN(targetY)) return;
        if (!this.lastCameraPosition){
            this.lastCameraPosition = {};
        }

        this.lastCameraPosition.x = this.camera.x;
        this.lastCameraPosition.y = this.camera.y;

        this.camera.x = this.viewportWidth / 2 - targetX;
        this.camera.y = this.viewportHeight / 2 - targetY;
        this.lookingAt.x = targetX;
        this.lookingAt.y = targetY;
    }

    draw() {
        super.draw();

        let now = Date.now();

        if (!this.isReady) return;

        let worldWidth = this.gameEngine.worldSettings.width;
        let worldHeight = this.gameEngine.worldSettings.height;

        let viewportSeesLeftBound = this.camera.x > 0;
        let viewportSeesRightBound = this.camera.x < this.viewportWidth - worldWidth;
        let viewportSeesTopBound = this.camera.y > 0;
        let viewportSeesBottomBound = this.camera.y < this.viewportHeight - worldHeight;

        for (let objId of Object.keys(this.sprites)) {
            let objData = this.gameEngine.world.objects[objId];
            let sprite = this.sprites[objId];

            if (objData) {

                sprite.x = objData.position.x;
                sprite.y = objData.position.y;

                if (objData.class === Pacman) {
                    sprite.actor.containerSprite.rotation = this.gameEngine.objects[objId].angle * Math.PI / 180;
                } else {
                    sprite.rotation = this.gameEngine.world.objects[objId].angle * Math.PI / 180;
                }

                // make the wraparound seamless for objects other than the player ship
                if (sprite !== this.playerPacman && viewportSeesLeftBound && objData.position.x > this.viewportWidth - this.camera.x) {
                    sprite.x = objData.position.x - worldWidth;
                }
                if (sprite !== this.playerPacman && viewportSeesRightBound && objData.position.x < -this.camera.x) {
                    sprite.x = objData.position.x + worldWidth;
                }
                if (sprite !== this.playerPacman && viewportSeesTopBound && objData.position.y > this.viewportHeight - this.camera.y) {
                    sprite.y = objData.position.y - worldHeight;
                }
                if (sprite !== this.playerPacman && viewportSeesBottomBound && objData.position.y < -this.camera.y) {
                    sprite.y = objData.position.y + worldHeight;
                }
            }
        }
    }

    updateHUD(data) {
        if (data.RTT) {
            $('#latency').text(data.RTT);
        }
        if (data.RTTAverage) {
            $('#average').text( () => {
                    let multiplier = Math.pow(10, 2);
                    let adjustedNum = data.RTTAverage * multiplier;
                    let truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

                    return truncatedNum / multiplier;
            });
        }
    }

    updateScore() {

    }
}
module.exports = TapchanRenderer;