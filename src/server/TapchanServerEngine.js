/**
 * Created by Snippy on 2017-04-28.
 */

const ServerEngine = require('lance-gg').ServerEngine;
const Map = require('./Map');

class TapchanServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);

        this.scoreData = {};
    }

    start() {
        super.start();

        let map = {};
        map.lines = [
            'xxxxxxxxx',
            'x       x',
            'x   x   x',
            'x       x',
            'x   x   x',
            'x       x',
            'x   x   x',
            'x       x',
            'xxxxxxxxx',
        ];

        for (let i = 0; i < map.lines.length; i++) {
            for (let j = 0; j < map.lines[i].length; j++) {

                if (map.lines[i][j] === 'x') {
                    this.gameEngine.makeWall(j * w, i * h, w, h);
                }
            }
        }
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        // function makePlayerPacman(gameEngine) {
        let makePlayerPacman = () => {
            let pacman = this.gameEngine.makePacman(socket.playerId);

            this.scoreData[pacman.id] = {
                points: 0,
                name: 'Pacman' + pacman.id,
            };
            this.updateScore();
        };

        //handle client restart requests
        socket.on('restartRequest', () => makePlayerPacman);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        for(let objId of Object.keys(this.gameEngine.world.objects)) {
            let obj = this.gameEngine.world.objects[objId];
            if(obj.playerId === playerId) {
                //remove score data
                if (this.scoreData[objId]) {
                    delete this.scoreData[objId];
                }
                delete this.gameEngine.world.objects[objId];
            }
        }

        this.updateScore();
    }

    updateScore() {
        //delay so a player socket can catch up
        setTimeout(() => {
            this.io.sockets.emit('scoreUpdate', this.scoreData);
        }, 1000);
    }
}
module.exports = TapchanServerEngine;