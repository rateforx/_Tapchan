/**
 * Created by Snippy on 2017-04-28.
 */

const ServerEngine      = require('lance-gg').ServerEngine;

class TapchanServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);

        this.pacmans = [];
        // this.ghosts = [];
        // this.walls = [];
    }

    start() {
        super.start();
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        this.pacmans.push(socket.id)
        this.gameEngine.
        console.log('Player ' + socket.id + ' connected.');
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.pacmans.splice(this.pacmans.indexOf(socketId), 1);
    }
}
module.exports = TapchanServerEngine;