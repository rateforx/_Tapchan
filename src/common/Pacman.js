/**
 * Created by Snippy on 2017-04-27.
 */

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Pacman extends DynamicObject {

    constructor(id, x, y, playerId) {
        super(id);

        this.position.set(x, y);
        this.angle = 90; //facing right
        this.playerId = playerId;
        this.class = Pacman;
        this.size = 40;
        this.speed = 50;
    }

    // onAddToWorld(gameEngine) {
    //     if (gameEngine.renderer) {
    //         gameEngine.renderer.addObject(this, 'pacman');
    //     }
    // }

}
module.exports = Pacman;