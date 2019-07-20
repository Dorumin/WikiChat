const EventEmitter = require('events').EventEmitter;

class Status extends EventEmitter {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = Status;