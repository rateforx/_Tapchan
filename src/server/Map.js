/**
 * Created by Snippy on 2017-05-17.
 */

const fs = require('fs');

class Map {

    static load(name) {
        let path =  './public/maps/' + name + '.map';
        let data = fs.readFileSync(path, 'utf8');
        data = data.trim();
        console.log('Map loaded from: "' + path + '", printing:');
        console.log(data);

        let lines = data.split(/\r\n|\r|\n/);
        let height = lines.length;
        let width = 0;
        for(let i = 0; i < lines.length; i++) {
            width = width < lines[i].length ? lines[i].length : width;
        }

        return {
            lines: lines,
            width: width,
            height: height,
        }
    }

}
module.exports = Map;
