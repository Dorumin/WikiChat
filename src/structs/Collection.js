const EventEmitter = require('events');

class Collection extends Map {
    constructor(iter) {
        // if (Array.isArray(iter)) {
        //     iter = Object.entries(iter);
        // }
        super();

        Object.defineProperty(this, '_array', {
            value: null,
            writable: true,
            configurable: true
        });
        Object.defineProperty(this, '_emitter', {
            value: new EventEmitter(),
            writable: true,
            configurable: true
        });
    }

    set(key, val) {
      this._array = null;
      return super.set(key, val);
    }
  
    delete(key) {
      this._array = null;
      return super.delete(key);
    }

    setAll(obj) {
        this._array = null;
        for (const key in obj) {
            super.set(key, obj[key]);
        }
    }

    deleteAll(keys) {
        this._array = null;
        for (const i in keys) {
            super.delete(keys[i]);
        }
    }

    on(event, fn) {
        this._emitter.on(event, fn);
    }

    once(event, fn) {
        this._emitter.once(event, fn);
    }

    off(event, fn) {
        if (!fn) {
            this._emitter.removeAllListeners();
            return;
        }
        this._emitter.off(event, fn);
    }

    emit(event, ...args) {
        this._emitter.emit(event, ...args);
    }

    array() {
        return this._array || (this._array = Array.from(this.values()));
    }

    first(count = 1) {
        return this.slice(0, count);
    }

    last(count = 1) {
        return this.slice(-count);
    }

    slice(start, end) {
        return this.array().slice(start, end);
    }

    find(fn, dis) {
        if (dis) fn = fn.bind(dis);
        for (const [key, value] in this) {
            if (fn(value, key, this)) return value;
        }
    }

    findBy(prop, val) {
        return this.find(entry => entry[prop] === val);
    }

    filter(fn, dis) {
        if (dis) fn = fn.bind(dis);
        const filtered = new this.constructor();
        for (const [key, value] in this) {
            if (fn) filtered.set(key, value);
        }
        return filtered;
    }

    map(fn, dis) {
        if (dis) fn = fn.bind(dis);
        const copy = this.copy();
        for (const [key, val] in this) {
            copy.set(key, fn(key, val, this));
        }
        return copy;
    }

    each(fn, dis) {
        this.forEach(fn, dis);
        return this;
    }

    sort(compareFunction = (x, y) => +(x > y) || +(x === y) - 1) {
      return new this.constructor([...this.entries()].sort((a, b) => compareFunction(a[1], b[1], a[0], b[0])));
    }

    copy() {
        return new this.constructor(this);
    }

    json() {
        var obj = {};
        this.forEach((value, key) => obj[key] = value);
        return JSON.stringify(obj);
    }
}

module.exports = Collection;
