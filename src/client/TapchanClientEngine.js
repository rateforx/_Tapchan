/**
 * Created by Snippy on 2017-05-03.
 */

const ClientEngine = require('lance-gg').ClientEngine;
const TapchanRenderer = require('./TapchanRenderer');

class TapchanClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, TapchanRenderer);

        this.gameEngine.on('client__preStep', this.preStep.bind(this));

        //keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false,
            left: false,
            right: false,
            // space: false,
        };

        // document.onkeydown = (e) => this.onKeyChange(e, true);
        // document.onkeyup = (e) => this.onKeyChange(e, true);
        $(document).on('keyDown', (e) => this.onKeyChange(e, true));
        $(document).on('keyUp', (e) => this.onKeyChange(e, true));
    }

    start() {
        super.start();

        this.gameEngine.once('renderer.ready', () => {
            //click event for "try again" button
            $('#tryAgain, #joinGame').on('click', () => {
                this.socket.emit('requestRestart');
            })
        })

        this.networkMonitor.on('RTTUpdate', (e) => {
            this.renderer.updateHUD(e);
        })
    }

    connect() {
        return super.connect().then( () => {

            this.socket.on('scoreUpdate', (e) => {
                this.renderer.updateScore(e);
            });

            this.socket.on('disconnect', (e) => {
                console.log('---Disconnected---');
                //todo show reconnect button on page
            });

            //opt: add autostart feature
        })
    }

    //our pre-step is to process all inputs
    preStep() {

        if (this.pressedKeys.up)    this.sendInput('up', { movement: true });
        if (this.pressedKeys.down)  this.sendInput('down', { movement: true });
        if (this.pressedKeys.left)  this.sendInput('left', { movement: true });
        if (this.pressedKeys.right) this.sendInput('right', { movement: true });
        // if (this.pressedKey.space)  this.sendInput('space', { movement: true });
    }

    onKeyChange(e, isDown) {
        e = e || window.event;

        if (e.keyCode == '38') {
            this.pressedKeys.up = isDown;
        } else if (e.keyCode == '40') {
            this.pressedKeys.down = isDown;
        } else if (e.keyCode == '37') {
            this.pressedKeys.left = isDown;
        } else if (e.keyCode == '39') {
            this.pressedKeys.right = isDown;
        // } else if (e.keyCode == '32') {
        //     this.pressedKeys.space = isDown;
        }
    }
}

module.exports = TapchanClientEngine;