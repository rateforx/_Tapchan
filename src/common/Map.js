/**
 * Created by Snippy on 2017-05-17.
 */

const fs = require('fs');

class Map {

    constructor(name) {

        this.name = name;
        this.load(name);
        this.data = [];
    }

    load() {
        let path =  './public/maps/' + this.name + '.map';
        this.data = fs.readFileSync(path, 'utf8');
        console.log('Map loaded from: "' + path + '", printing:');
        console.log(this.data);
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
}
module.exports = Map;
