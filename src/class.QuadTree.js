export default class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.cap = capacity;
        this.data = [];
        this.children = {};
    }

    subdivide() {
        const { x, y, w, h } = this.boundary;
        this.children = {};
        this.children.topLeft = new QuadTree({ x: x - w / 4, y: y - h / 4, w: w / 2, h: h / 2 }, this.cap);
        this.children.topRight = new QuadTree({ x: x + w / 4, y: y - h / 4, w: w / 2, h: h / 2 }, this.cap);
        this.children.bottomLeft = new QuadTree({ x: x - w / 4, y: y + h / 4, w: w / 2, h: h / 2 }, this.cap);
        this.children.bottomRight = new QuadTree({ x: x - w / 4, y: y + h / 4, w: w / 2, h: h / 2 }, this.cap);
    }

    insert(index, x, y) {
        if (this.data.length < this.cap) {
            this.data.push({ index, x, y });
            return;
        }
        if (Object.keys(this.children).length === 0) {
            this.subdivide();
        }
        if (x < this.boundary.x && y < this.boundary.y) {
            this.children.topLeft.insert(index, x, y);
        } else if (x > this.boundary.x && y < this.boundary.y) {
            this.children.topRight.insert(index, x, y);
        } else if (x < this.boundary.x && y > this.boundary.y) {
            this.children.bottomLeft.insert(index, x, y);
        } else {
            this.children.bottomRight.insert(index, x, y);
        }
    }

    findWithin(result, range) {
        if (range.x + range.w / 2 < this.boundary.x - this.boundary.w / 2 || range.x - range.w / 2 > this.boundary.x + this.boundary.w / 2 || range.y + range.h / 2 < this.boundary.y - this.boundary.h / 2 || range.y - range.h / 2 > this.boundary.y + this.boundary.h / 2) {
            return;
        }
        for (const data of this.data) {
            if (Math.abs(data.x - range.x) < range.w / 2 && Math.abs(data.y - range.y) < range.h / 2) {
                result.push(data.index);
            }
        }
        Object.values(this.children).forEach(subtree => subtree.findWithin(result, range));
    }
};
