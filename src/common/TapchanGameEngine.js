/**
 * Created by Snippy on 2017-04-27.
 */

const GameEngine = require('lance-gg').GameEngine;
const Timer = require('./Timer');

const Pacman = require('./Pacman');
const Ghost = require('./Ghost');
const Wall = require('./Wall');
const Collectibles = require('./Collectibles');

class TapchanGameEngine extends GameEngine {

    start() {
        super.start();

        this.timer = new Timer();
        this.timer.play();
        this.on('server__postStep', () => {
            this.timer.tick();
        });

        this.worldSettings = {
            worldWrap: true,
            width: 360,
            height: 360,
        };

        this.on('collisionStart', (e) => {
            //todo handle collisions
        });

        this.on('postStep', () => {
            //opt do stuff
        })
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
        let x = this.worldSettings.width / 2;
        let y = this.worldSettings.height / 2;

        let pacman = new Pacman(++this.world.idCount, this, x, y);
        pacman.playerId = playerId;
        this.addObjectToWorld(pacman);
        console.log('+Pacman ' + pacman.toString());

        return pacman;
    }
}
module.exports = TapchanGameEngine;