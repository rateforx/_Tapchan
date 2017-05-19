/**
 * Created by Snippy on 2017-05-17.
 */

const fs = require('fs');

class Map {

    constructor(name) {

        this.name = name;
        this.data = [];
        this.width = 0;
        this.height = 0;
        this.load(name);
    }

    load() {
        let path =  './public/maps/' + this.name + '.map';
        this.data = fs.readFileSync(path, 'utf8');
        console.log('Map loaded from: "' + path + '", printing:');
        console.log(this.data);
        this.calcSize();
    }

    loadAsync() {
        fs.readFile(path, 'utf8', (error, data) => {
             if (error) {
                console.log('err: ' + error);
                return false;
             }
             this.data = data;
        });
    }

    calcSize() {
        let i = 0;
        let data = this.data.toString();
        // for (let x in data) {
        //     if (x === `\n`) i++;
        // }
        for (let i = 0; i < this.data.length; )

        // console.log('Lines: ', i);
        // this.height = i;
    }

    getSize() {


        // return { w: w, h: h };
    }
}
module.exports = Map;
