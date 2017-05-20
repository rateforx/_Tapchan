/**
 * Created by Snippy on 2017-04-28.
 */

const Renderer = require('lance-gg').render.Renderer;
const Pixi = require('pixi.js');
// const Camera = require('./Camera');

class TapchanRenderer extends Renderer {

    get ASSETPATHS() {
        return {
            pacman:  'public/assets/pacman.png',
            ghost:   'public/assets/ghost.png',
            wall:    'public/assets/wall.png',
            clouds1: 'public/assets/clouds1.png',
            clouds2: 'public/assets/clouds2.png',
        }
    }

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.isReady = false;

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

        this.stage = new Pixi.Container();
        this.layer1 = new Pixi.Container();
        this.layer2 = new Pixi.Container();

        this.stage.addChild(this.layer1, this.layer2);

        $(document).on('DOMContentLoaded', () => this.onDOMLoaded() );
        /*if (document.readyState === 'complete' ||
                document.readyState === 'loaded' ||
                document.readyState === 'interactive') {

            this.onDOMLoaded();
        } else {
            document.addEventListener('DOMContentLoaded'), () => {
                this.onDOMLoaded();
            }
        }*/

        return new Promise( (resolve, reject) => {
            Pixi.loader.add(Object.keys(this.ASSETPATHS).map( (x) => {
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
        this.renderer = Pixi.autoDetectRenderer(this.viewportWidth, this.viewportHeight);
        $('.pixiContainer').appendChild(this.renderer.view);
    }

    setupStage() {
        window.onresize = () => this.setRendererSize();

        //background
        this.clouds1 = new Pixi.extras.TilingSprite(Pixi.loader.resources.clouds1.texture, this.viewportWidth, this.viewportHeight);
        this.clouds2 = new Pixi.extras.TilingSprite(Pixi.loader.resources.clouds2.texture, this.viewportWidth, this.viewportHeight);

        this.clouds1.blendMode = Pixi.BLEND_MODES.ADD;
        this.clouds2.blendMode = Pixi.BLEND_MODES.ADD;
        this.clouds2.alpha = .65;

        this.stage.addChild(this.clouds1, this.clouds2);
        this.stage.addChild(this.camera);

        this.deltaTime = Data.now();

        //debug
        if ('showworldbounds' in Utils.getUrlVars()) {
            let graphics = new Pixi.Graphics();
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

        }

        /*
        //get canvas
        let canvas = document.getElementById('thegame');
        let context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        for(let obj in this.gameEngine.world.objects) {
            switch (obj.class) {
                case
            }
        }
        */
    }

    /*
    drawWall(context) {
        context.fillRect()
    }

    drawPacman(context) {
        context.beginPath();
        context.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
        context.fillStyle = 'yellow';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = 'darkyellow';
        context.stroke();
        context.closePath();
    }
    */

    updateHUD() {

    }

    updateScore() {

    }
}
module.exports = TapchanRenderer;