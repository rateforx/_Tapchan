/**
 * Created by Snippy on 2017-04-28.
 */

const Renderer = require('lance-gg').render.Renderer;
const PIXI = require('pixi.js');
const Utils = require('../common/Utils');

const Pacman = require('../common/Pacman');
const Ghost = require('../common/Ghost');
const Wall = require('../common/Wall');

class TapchanRenderer extends Renderer {

    get ASSETPATHS() {
        return {
            pacman:  'assets/pacman.png',
            ghost:   'assets/ghost.png',
            wall:    'assets/wall.png',
            bg1:     'assets/clouds1.png',
            bg2:     'assets/clouds2.png',
        }
    }

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.isReady = false;

        this.assetPathPrefix = this.gameEngine.options.assetPathPrefix ? this.gameEngine.options.assetPathPrefix : '';

        this.bgPhaseX = 0;
        this.bgPhaseY = 0;
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
        this.bg1 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg1.texture, this.viewportWidth, this.viewportHeight);
        this.bg2 = new PIXI.extras.TilingSprite(PIXI.loader.resources.bg2.texture, this.viewportWidth, this.viewportHeight);

        this.bg1.blendMode = PIXI.BLEND_MODES.ADD;
        this.bg2.blendMode = PIXI.BLEND_MODES.ADD;
        this.bg2.alpha = .65;

        this.stage.addChild(this.bg1, this.bg2);
        this.stage.addChild(this.camera);

        this.deltaTime = Date.now();

        //debug
        if ('showworldbounds' in Utils.getUrlVars()) {
            let graphics = new PIXI.Graphics();
            graphics.beginFill('0xC21F7B');
            graphics.alpha = .1;
            graphics.drawRect(0, 0, this.gameEngine.worldSettings.width, this.gameEngine.worldSettings.height);
            this.camera.addChild(graphics);
        }
    }

    setRendererSize() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;

        this.bg1.width = this.viewportWidth;
        this.bg1.height = this.viewportHeight;
        this.bg2.width = this.viewportWidth;
        this.bg2.height = this.viewportHeight;

        this.renderer.resize(this.viewportWidth, this.viewportHeight);
    }

    addObject(objData, options) {
        let sprite;

        if (objData.class === Pacman) {

            let pacmanActor = sprite; //save ref to player pacman
            sprite.actor.pacmanSprite.tint = 0xFFFF00; //color player pacman yellow todo should be set by player

            // $('#tryAgain, #joinGame').disable().hide();

            this.clientEngine.gameStarted = true;

            //remove tutorial after timeout
            setTimeout( () => {
                $('body').addClass('tutorial');
            }, 10000);

        } else if (objData.class === Ghost) {

            sprite = new PIXI.Sprite(PIXI.loader.resources.ghost.texture);
            this.sprites[objData.id] = sprite;

            sprite.width = 40;
            sprite.height = 40;

            sprite.anchor.set(.5, .5);

        } else if (objData.class === Wall) {

            sprite = new PIXI.Sprite(PIXI.loader.resources.wall.texture);
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

            if (sprite) {
                //object is eigher a Pixi sprite or an Actor. Actors have renderSteps
                if (sprite.actor && sprite.actor.renderStep) {
                    sprite.actor.renderStep(now - this.deltaTime);
                }
            }
        }

        let cameraTarget;
        if (this.playerPacman) {
            cameraTarget = this.playerPacman;
            // this.cameraRoam = false;
        } else if (!this.clientEngine.gameStarted && !cameraTarget) {
            //calculate centroid
            cameraTarget = getCentroid(this.gameEngine.world.objects);
            this.cameraRoam = true;
        }

        if (cameraTarget) {
            //let bgOffsetX = -this.bgPhaseX * worldWidth - cameraTarget.x;
            //let bgOffsetY = -this.bgPhaseY * worldHeight - cameraTarget.y;

            // 'cameraroam' in Utils.getUrlVars();
            if (this.cameraRoam) {
                let lookingAtDeltaX = cameraTarget.x - this.lookingAt.x;
                let lookingAtDeltaY = cameraTarget.y - this.lookingAt.y;
                let cameraTempTargetX;
                let cameraTempTargetY;

                if (lookingAtDeltaX > worldWidth / 2) {
                    this.bgPhaseX++;
                    cameraTempTargetX = this.lookingAt.x + worldWidth;
                } else if (lookingAtDeltaX < -worldWidth / 2) {
                    this.bgPhaseX--;
                    cameraTempTargetX = this.lookingAt.x - worldWidth;
                } else {
                    cameraTempTargetX = this.lookingAt.x * .02;
                }

                if (lookingAtDeltaY > worldHeight / 2) {
                    this.bgPhaseY++;
                    cameraTempTargetY = this.lookingAt.y + worldHeight;
                } else if (lookingAtDeltaY < -worldHeight / 2) {
                    this.bgPhaseY--;
                    cameraTempTargetY = this.lookingAt.y - worldHeight;
                } else {
                    cameraTempTargetY = this.lookingAt.y * .02;
                }

                this.centerCamera(cameraTempTargetX, cameraTempTargetY);

            } else {
                this.centerCamera(cameraTarget.x, cameraTarget.y);
            }
        }

        let bgOffsetX = this.bgPhaseX * worldWidth + this.camera.x;
        let bgOffsetY = this.bgPhaseY * worldHeight + this.camera.y;

        this.bg1.tilePosition.x = bgOffsetX * .01;
        this.bg1.tilePosition.y = bgOffsetY * .01;

        this.bg2.tilePosition.x = bgOffsetX * .04;
        this.bg2.tilePosition.y = bgOffsetY * .04;

        this.deltaTime = now;

        //draw stuff!!!
        this.renderer.render(this.stage);
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

function getCentroid(objects) {
    let maxDistance = 500; // max distance to add to the centroid
    let shipCount = 0;
    let centroid = {x: 0, y: 0};
    let selectedShip = null;

    for (let id of Object.keys(objects)) {
        let obj = objects[id];
        if (obj.class === Pacman) {
            if (selectedShip === null)
                selectedShip = obj;

            let objDistance = Math.sqrt(Math.pow((selectedShip.position.x - obj.position.y), 2) + Math.pow((selectedShip.position.y - obj.position.y), 2));
            if (selectedShip === obj || objDistance < maxDistance) {
                centroid.x += obj.position.x;
                centroid.y += obj.position.y;
                shipCount++;
            }
        }
    }

    centroid.x /= shipCount;
    centroid.y /= shipCount;

    return centroid;
}

module.exports = TapchanRenderer;