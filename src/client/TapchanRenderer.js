/**
 * Created by Snippy on 2017-04-28.
 */

const Renderer      = require('lance-gg').Renderer;

const canvas      = document.getElementById('thegame');
const context     = canvas.getContext('2d');

class TapchanRenderer extends Renderer {

    draw() {
        super.draw();

        //todo draw stuff

        context.fillStyle = 'lightgreen';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}
module.exports = TapchanRenderer;