import * as PIXI from 'pixi.js';
import Vector from './class.Vector';
import Fish from './class.Fish';

export default class GiantFish extends Fish {
    constructor(texture, width, velocity, layer) {
        const x = Math.floor(Math.random() * window.innerWidth);
        const y = Math.floor(Math.random() * window.innerHeight);
        super(texture, width, velocity, x, y);
        this.maxWidth = width;
        this.maxForce = 0.1;
        this.container = new PIXI.Container();
        this.container.zIndex = layer;
        this.container.addChild(super.getRenderableObject());
        this.changeFrame();
    }

    getRenderableObject() {
        return this.container;
    }

    changeFrame() {
        this.ax = (Math.random() < 0.5 ? -1 : 1) * Math.random() * this.minSpeed;
        this.ay = (Math.random() < 0.5 ? -1 : 1) * Math.random() * this.minSpeed;
        this.counter = 1;
        this.step = this.maxWidth + Math.floor(2 * Math.random() * this.maxWidth);
    }

    snapshot() {
        super.snapshot([]);
        if (this.counter % this.step === 0) {
            this.changeFrame();
        }
        this.counter++;
        if (Math.abs(this.buffer.velocity.y) > this.minSpeed) {
            this.buffer.velocity.y = (this.buffer.velocity.y > 0 ? 1 : -1) * this.minSpeed;
        }
        this.buffer.acceleration = new Vector(this.ax, this.ay);
        this.buffer.acceleration.limit(this.maxForce);
    }

    update() {
        this.snapshot();
        if (this.sprite.width > this.maxWidth / 2 && this.sprite.y < window.innerHeight / 2 && (this.sprite.x < window.innerWidth / 2 && this.buffer.velocity.x > 0) || (this.sprite.x > window.innerWidth / 2 && this.buffer.velocity.x < 0)) {
            this.sprite.width -= 0.2;
            this.sprite.height = this.sprite.width * 0.75;
        } else if (this.sprite.width < this.maxWidth) {
            this.sprite.width += 0.2;
            this.sprite.height = this.sprite.width * 0.75;
        }
        super.update();
    }
};
