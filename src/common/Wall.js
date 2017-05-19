/**
 * Created by Snippy on 2017-04-27.
 */

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Wall extends DynamicObject {

    constructor(id, x, y, w, h) {
        super(id);
        this.position.set(x, y);
        this.width = w;
        this.height = h;
        this.class = Wall;
    }
}
module.exports = Wall;