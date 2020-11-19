export default class Vector {
    constructor(x, y) {
        if (arguments.length === 1) {
            const v = x;
            this.x = v.x;
            this.y = v.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        if (this.x !== 0 && this.y !== 0) {
            const l = this.length();
            this.x /= l;
            this.y /= l;
        }
        return this;
    }

    limit(max, min) {
        const l = this.length();
        if (l > max) {
            this.normalize().scale(max);
        } else if (l < min) {
            this.normalize().scale(min);
        }
        return this;
    }

    set(x, y) {
        if (arguments.length === 1) {
            const v = x;
            this.x = v.x;
            this.y = v.y;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    angle(radians) {
        if (!radians) {
            return Math.atan2(this.y, this.x);
        }
        const l = this.length();
        this.x = l * Math.sin(radians);
        this.y = l * Math.cos(radians);
        return this;
    }
};
