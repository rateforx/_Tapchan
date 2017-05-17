/**
 * Created by Snippy on 2017-05-17.
 */

class Camera {

    constructor(x, y, w, h) {

        this.position = {
            x, y,
            set: (x, y) => {
                this.x = x;
                this.y = y;
            }
        };
        this.position.set(x, y);

        this.scale = 1;
        this.size = {
            w, h,
            set: (w, h) => {
                this.w = w;
                this.h = h;
            }
        };
        this.size.set(w, h);

        this.update = (x, y) => {
            this.position.set(x, y);
        };
        this.update = (x, y, w, h) => {
            this.position.set(x, y);
            this.size.set(w, h);
        };

    }

}