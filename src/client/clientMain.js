/**
 * Created by Snippy on 2017-05-03.
 */

const qsOptions = (require('querystring')).parse(location.search);
const TapchanClientEngine = require('./TapchanClientEngine');
const TapchanGameEngine = require('../common/TapchanGameEngine');
const SimplePhysicsEngine = require('lance-gg').physics.SimplePhysicsEngine;

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    autoConnect: true,
    traceLevel: 1,
    delayInputCount: 3,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.0,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);

// extrapolate mode requires a physics engine on the client
if (options.syncOptions.sync === 'extrapolate')
    options.physicsEngine = new SimplePhysicsEngine();

// create a client engine and a game engine
const gameEngine = new TapchanGameEngine(options);
const clientEngine = new TapchanClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { promise = clientEngine.start(); });
