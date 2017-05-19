/**
 * Created by Snippy on 2017-04-28.
 */

const Renderer = require('lance-gg').render.Renderer;
const Camera = require('./Camera');

class TapchanRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);

        window.onresize = () => {
            let canvas = document.getElementById('thegame');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        console.log('playerid: ' + this.clientEngine.playerId );
        // this.camera = new Camera();
    }

    draw() {
        super.draw();
        //get canvas
        let canvas = document.getElementById('thegame');
        let context = canvas.getContext('2d');
        context.fillStyle = '#2d2d2d';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //todo draw stuff
        this.drawPlayers(context);
    }

    drawPlayers(context) {
        for(let i = 0; i < this.gameEngine.players.length; i++) {
            let player = this.gameEngine.players[i];

            context.beginPath();
            context.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
            context.fillStyle = 'yellow';
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = 'darkyellow';
            context.stroke();
            context.closePath();
        }
    }

    /*addObject(dynamicObject, type) {

    }

    removeObject() {

    }*/
}
module.exports = TapchanRenderer;