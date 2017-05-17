/**
 * Created by Snippy on 2017-04-27.
 */

const GameEngine    = require('lance-gg').GameEngine;
const Pacman        = require('./Pacman');
const Ghost         = require('./Ghost');
const Wall          = require('./Wall');
const Collectibles  = require('./Collectibles');
const Map           = require('./Map');

class TapchanGameEngine extends GameEngine {

    constructor() {
        super();

        this.players = [];
        this.ghosts  = [];
        this.walls   = [];
    }

    start() {
        super.start();

        this.on('postStep', () => this.postStepHandlePacman() );
        this.on('objectAdded', (object) => {
            //todo
            /*if (object.id == 1) {
             this.paddle1 = object;
             } else if (object.id == 2) {
             this.paddle2 = object;
             } else if (object.class == Ball) {
             this.ball = object;
             }*/
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


    initGame() {

        this.addObjectToWorld(new Pacman(++this.world.idCount, 0, 0, 0));
        let map = new Map('test');
    }


    postStepHandlePacman() {
        //todo collisions and stuff
    }
}
module.exports = TapchanGameEngine;