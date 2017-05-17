/**
 * Created by Snippy on 2017-04-28.
 */

const ServerEngine      = require('lance-gg').ServerEngine;

class TapchanServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();
        this.gameEngine.initGame();
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);

        this.players.push(socket.id);
        console.log('Player ' + socket.id + ' connected.');
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        this.players.splice(this.players.indexOf(socketId), 1);
    }
}
module.exports = TapchanServerEngine;