import * as PIXI from 'pixi.js';
import Fish from './class.Fish';
import QuadTree from './class.QuadTree';

export default class FishSchool {
    constructor(texture, width, velocity, number, layer) {
        this.fishes = [];
        this.container = new PIXI.Container();
        this.container.zIndex = layer;
        this._addFish = (fishes, container) => {
            for (let i = 0; i < number; i++) {
                const x = Math.floor(Math.random() * window.innerWidth);
                const y = Math.floor(Math.random() * window.innerHeight);
                const fish = new Fish(texture, width, velocity, x, y);
                fishes.push(fish);
                container.addChild(fish.getRenderableObject());
            }
        };
        this._addFish(this.fishes, this.container);
        this.perception = width * 10;
        this.qt = undefined;
    }

    getRenderableObject() {
        return this.container;
    }

    addFish() {
        this._addFish(this.fishes, this.container);
        return this;
    }

    buildQuadTree() {
        const width = window.innerWidth, height = window.innerHeight;
        this.qt = new QuadTree({ x: width / 2, y: height / 2, w: width, h: height }, 5);
        for (let i = 0; i < this.fishes.length; i++) {
            this.qt.insert(i, this.fishes[i].sprite.x, this.fishes[i].sprite.y);
        }
    }

    update() {
        this.buildQuadTree();
        for (const fish of this.fishes) {
            let neighbors = [];
            this.qt.findWithin(neighbors, { x: fish.sprite.x, y: fish.sprite.y, w: this.perception * 2, h: this.perception * 2 });
            neighbors = neighbors.map(index => this.fishes[index]);
            fish.snapshot(neighbors);
        }
        this.fishes.forEach(fish => fish.update());
    }
};
