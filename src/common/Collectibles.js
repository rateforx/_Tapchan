/**
 * Created by Snippy on 2017-04-27.
 */

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Collectible extends DynamicObject {

    constructor(id, x, y, type) {
        super(id);
        this.position.set(x, y);
        this.type = type;
        this.class = Collectible;
    }

    // onAddToWorld(gameEngine) {
    //     if (gameEngine.renderer) {
    //         gameEngine.renderer.addSprite(this, 'pacman');
    //     }
    // }
}

class Food extends Collectible {
    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'food');
        }
    }
}

module.exports = Collectible;