/**
 * Created by Snippy on 2017-04-27.
 */

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Ghost extends DynamicObject {

    constructor(id, x, y) {
        super(id);
        this.position.set(x, y);
        this.class = Ghost;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'ghost');
        }
    }
}
module.exports = Ghost;