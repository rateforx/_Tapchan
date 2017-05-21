/**
 * Created by Snippy on 2017-05-20.
 */

const PIXI = require('pixi.js');
const PixiParticles = require('pixi-particles');

const DeathEmitterConfig = require('./DeathEmitter.json');

class PacmanActor {

    constructor(renderer) {
        this.gameEngine = renderer.gameEngine;
        this.backLayer = renderer.layer1;
        this.sprite = new Pixi.Container();
        this.containerSprite = new Pixi.Container();

        this.shipSprite = new PIXI.Sprite(PIXI.loader.resources.ship.texture);

        //keep a ref to the actor from the sprite
        this.sprite.actor = this;

        this.shipSprite.anchor.set(.5, .5);
        this.shipSprite.width = 40;
        this.shipSprite.height = 40;

        this.addEmitter();
        this.sprite.addChild(this.containerSprite);
        this.containerSprite.addChild(this.shipSprite);
    }

    renderStep(delta) {
        if (this.deathEmitter) {
            this.deathEmitter.update(delta * .001);

        }
    }

    changeName(name) {
        if (this.nameText != null) {
            this.nameText.destroy();
        }
        this.nameText = new PIXI.Text(name, {
            fontFamily: 'consolas',
            fontSize: '12px',
            fill: 'white',
        });
        this.nameText.anchor.set(.5, .5);
        this.nameText.y = -30;
        this.nameText.alpha = .15;
        this.sprite.addChild(this.nameText);
    }

    addEmitter() {
        this.deathEmitter = new PIXI.particles.Emitter(
            this.containerSprite, [PIXI.loader.resources.deathSprite.texture], DeathEmitterConfig
        );
        this.deathEmitter.emit = false;
    }

    destroy() {
        return new Promise( (resolve) => {
            this.deathEmitter.emit = true;

            if (this.nameText) {
                this.nameText.destroy();
            }
            this.deathEmitter.destroy();
            this.deathEmitter = null;
            this.shipSprite.destroy();

            setTimeout( () => {
                this.containerSprite.destroy();
                this.deathEmitter.destroy();
                resolve();
            }, 3000);
        })
    }

}
module.exports = PacmanActor;