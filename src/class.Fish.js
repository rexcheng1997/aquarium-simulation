import * as PIXI from 'pixi.js';
import Vector from './class.Vector';

export default class Fish {
    constructor(texture, width, velocity, x, y) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = width;
        this.sprite.height = width * 0.75;
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        let vx = Math.max(velocity[0], Math.random() * velocity[1]),
            vy = Math.max(velocity[0], Math.random() * velocity[1]);
        if (Math.random() < 0.5) vx *= -1;
        if (Math.random() < 0.5) vy *= -1;
        this.velocity = new Vector(vx, vy);
        this.acceleration = new Vector(0, 0);
        this.minSpeed = velocity[0] * Math.sqrt(2);
        this.maxSpeed = velocity[1] * Math.sqrt(2);
        this.maxForce = 0.2;
        this.perception = width * 10;
        this.buffer = {};
    }

    getRenderableObject() {
        return this.sprite;
    }

    steer(neighbors) {
        const alignment = new Vector(0, 0);
        const cohesion = new Vector(0, 0);
        const separation = new Vector(0, 0);
        let total = 0;
        for (const other of neighbors) {
            const d = new Vector(other.sprite.x, other.sprite.y);
            d.subtract(new Vector(this.sprite.x, this.sprite.y));
            if (d.length() < this.perception) {
                alignment.add(other.velocity);
                cohesion.add(new Vector(other.sprite.x, other.sprite.y));
                const repel = new Vector(d);
                repel.scale(-1 / (1 + d.length()));
                separation.add(repel);
                total++;
            }
        }
        if (total > 0) {
            alignment.scale(1 / total)
                .normalize()
                .scale(this.maxSpeed)
                .subtract(this.velocity)
                .limit(this.maxForce);
            cohesion.scale(1 / total)
                .subtract(new Vector(this.sprite.x, this.sprite.y))
                .normalize()
                .scale(this.maxSpeed)
                .subtract(this.velocity)
                .limit(this.maxForce);
            separation.scale(1 / total)
                .normalize()
                .scale(this.maxSpeed)
                .subtract(this.velocity)
                .limit(this.maxForce);
        }
        return [alignment, cohesion, separation];
    }

    snapshot(neighbors) {
        this.buffer = {};
        this.buffer.pos = new Vector(this.sprite.x, this.sprite.y);
        this.buffer.pos.add(this.velocity);
        if (this.buffer.pos.x + this.sprite.width / 2 < 0) {
            this.buffer.pos.x = window.innerWidth + this.sprite.width / 2;
        } else if (this.buffer.pos.x - this.sprite.width / 2 > window.innerWidth) {
            this.buffer.pos.x = -this.sprite.width / 2;
        }
        if (this.buffer.pos.y + this.sprite.height / 2 < 0) {
            this.buffer.pos.y = window.innerHeight + this.sprite.height / 2;
        } else if (this.buffer.pos.y - this.sprite.height / 2 > window.innerHeight) {
            this.buffer.pos.y = -this.sprite.height / 2;
        }
        this.buffer.velocity = new Vector(this.velocity);
        this.buffer.velocity.add(this.acceleration).limit(this.maxSpeed, this.minSpeed);
        this.buffer.acceleration = new Vector(0, 0);
        const forces = this.steer(neighbors);
        forces.forEach(force => this.buffer.acceleration.add(force));
    }

    update() {
        if (Object.keys(this.buffer).length === 0) {
            console.warn('Class method "snapshot" must be called before "update"!');
            return;
        }
        const width = this.sprite.width;
        const radians = this.buffer.velocity.angle();
        this.sprite.x = this.buffer.pos.x;
        this.sprite.y = this.buffer.pos.y;
        if (radians > Math.PI / 2 || radians < -Math.PI / 2) {
            this.sprite.scale.y = -1;
            this.sprite.width = width;
            this.sprite.height = width * 0.75;
        } else {
            this.sprite.scale.y = 1;
            this.sprite.width = width;
            this.sprite.height = width * 0.75;
        }
        this.sprite.rotation = radians;
        this.velocity.set(this.buffer.velocity);
        this.acceleration.set(this.buffer.acceleration);
        this.buffer = undefined;
    }
};
