/**
 * Created by Snippy on 2017-04-27.
 */

const DynamicObject = require('lance-gg').serialize.DynamicObject;
let x = 1200;


class Pacman extends DynamicObject {

    constructor(id, x, y, playerId) {
        super(id);

        this.position.set(x, y);
        this.angle = 90; //facing right
        this.playerId = playerId;
        this.class = Pacman;
    }


    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'pacman');
        }
    }

}
module.exports = Pacman;