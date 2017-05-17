/**
 * Created by Snippy on 2017-04-28.
 */

const Renderer = require('lance-gg').render.Renderer;
const Campera = require('./Camera');

class TapchanRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);

        window.onresize = () => {
            let canvas = document.getElementById('thegame');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        this.camera = new Camera();
    }

    draw() {
        super.draw();
        //get canvas
        let canvas = document.getElementById('thegame');
        let context = canvas.getContext('2d');
        context.fillStyle = '#2d2d2d';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //todo draw stuff
    }

    /*addObject(dynamicObject, type) {

    }

    removeObject() {

    }*/
}
module.exports = TapchanRenderer;