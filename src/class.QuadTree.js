export default class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.cap = capacity;
        this.data = [];
        this.children = undefined;
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;
        this.children = {};
        this.children.topLeft = new QuadTree({ x: x - w / 2, y: y - h / 2, w: w / 2, h: h / 2 }, this.cap);
        this.children.topRight = new QuadTree({ x: x + w / 2, y: y - h / 2, w: w / 2, h: h / 2 }, this.cap);
        this.children.bottomLeft = new QuadTree({ x: x - w / 2, y: y + h / 2, w: w / 2, h: h / 2 }, this.cap);
        this.children.bottomRight = new QuadTree({ x: x - w / 2, y: y + h / 2, w: w / 2, h: h / 2 }, this.cap);
    }

    insert(data, x, y) {
        if (this.data.length < this.cap) {
            this.data.push({ index: data, x: x, y: y });
            return;
        }
        if (!this.children) {
            this.subdivide();
        }
        for (const data of this.data) {
            
        }
        if (x < this.boundary.x && y < this.boundary.y) {
            this.children.topLeft.insert(data, x, y);
        } else if (x > this.boundary.x && y < this.boundary.y) {
            this.children.topRight.insert(data, x, y);
        } else if (x < this.boundary.x && y > this.boundary.y) {
            this.children.bottomLeft.insert(data, x, y);
        } else {
            this.children.bottomRight.insert(data, x, y);
        }
    }
}
