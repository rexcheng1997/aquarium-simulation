import * as PIXI from 'pixi.js';
import Fish from './class.Fish';
import QuadTree from './class.QuadTree';

export default class FishSchool {
    constructor(texture, width, velocity, number, layer) {
        this.fishes = [];
        this.container = new PIXI.Container();
        this.container.zIndex = layer;
        for (let i = 0; i < number; i++) {
            const x = Math.floor(Math.random() * window.innerWidth);
            const y = Math.floor(Math.random() * window.innerHeight);
            this.fishes.push(new Fish(texture, width, velocity, x, y));
            this.container.addChild(this.fishes[i].getRenderableObject());
        }
        this.qt = undefined;
    }

    getRenderableObject() {
        return this.container;
    }

    buildQuadTree() {
        const width = window.innerWidth, height = window.innerHeight;
        this.qt = new QuadTree({ x: width / 2, y: height / 2, w: width, h: height }, 10);
        for (let i = 0; i < this.fishes.length; i++) {
            this.qt.insert(i, this.fishes[i].sprite.x, this.fishes[i].sprite.y);
        }
    }

    update() {
        // this.buildQuadTree();
        for (const fish of this.fishes) {
            fish.snapshot(this.fishes);
        }
        this.fishes.forEach(fish => fish.update());
    }
};
