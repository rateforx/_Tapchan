/**
 * Created by Snippy on 2017-05-20.
 */

const PIXI = require('pixi.js');
const PixiParticles = require('pixi-particles');

class PacmanActor {

    constructor(renderer) {
        this.gameEngine = renderer.gameEngine;
        this.backLayer = renderer.layer1;
        this.sprite = new Pixi.Container();
        this.shipContainerSprite = new Pixi.Container();

        this.shipSprite = new PIXI.Sprite(PIXI.loader.resources.ship.texture);

        //keep a ref to the actor from the sprite
        this.sprite.actor = this;

        this.shipSprite.anchor.set(.5, .5);
        this.shipSprite.width = 40;
        this.shipSprite.height = 40;

        this.sprite.addChild(this.shipContainerSprite);
        this.shipContainerSprite.addChild(this.shipSprite);
    }

    renderStep(delta) {
        if (this.deathEmitter) {
            this.death
        }
    }
}