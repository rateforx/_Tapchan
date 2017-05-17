/**
 * Created by Snippy on 2017-04-28.
 */

const Renderer = require('lance-gg').render.Renderer;

class TapchanRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);

        window.onresize = () => {
            let canvas = document.getElementById('thegame');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
    }

    /*init(...param) {
        let canvas = document.getElementById('thegame');
        let context = canvas.getContext('2d');
     }*/

    draw() {
        super.draw();
        //get canvas
        let canvas = document.getElementById('thegame');
        let context = canvas.getContext('2d');
        context.fillStyle = 'lightgreen';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //todo draw stuff
    }

    /*addObject(dynamicObject, type) {

    }

    removeObject() {

    }*/
}
module.exports = TapchanRenderer;