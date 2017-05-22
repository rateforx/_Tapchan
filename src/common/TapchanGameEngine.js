/**
 * Created by Snippy on 2017-04-27.
 */

const GameEngine    = require('lance-gg').GameEngine;
const Pacman        = require('./Pacman');
const Ghost         = require('./Ghost');
const Wall          = require('./Wall');
const Collectibles  = require('./Collectibles');
const Map           = require('../server/Map');

class TapchanGameEngine extends GameEngine {

    start() {
        super.start();
    }

    registerClasses(serializer) {
        serializer.registerClass(require('./Pacman'));
        serializer.registerClass(require('./Ghost'));
        serializer.registerClass(require('./Wall'));
        serializer.registerClass(require('./Collectibles'));
    }

    processInput(inputData, playerId, isServer) {
        super.processInput(inputData, playerId, false);

        let playerPacman = this.world.getPlayerObject(playerId);
        if (playerPacman) {
            switch (inputData.input) {
                case 'up'   : playerPacman.angle = 0; break;
                case 'down' : playerPacman.angle = 180; break;
                case 'left' : playerPacman.angle = 270; break;
                case 'right': playerPacman.angle = 90; break;
            }
        }
    }

    makeWall(x, y, w, h) {
        let wall = new Wall(++this.world.idCount, x, y, w, h);
        this.addObjectToWorld(wall);
        console.log('+Wall ' + wall.toString());

        return wall;
    }

    makePacman(playerId) {
        let x = gameEngine.worldSettings.width / 2;
        let y = gameEngine.worldSettings.height / 2;

        let pacman = new Pacman(++this.world.idCount, gameEngine, x, y);
        pacman.playerId = playerId;
        this.addObjectToWorld(pacman);
        console.log('+Pacman ' + pacman.toString());

        return pacman;
    }
}
module.exports = TapchanGameEngine;