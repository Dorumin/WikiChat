const EventEmitter = require('events').EventEmitter;

class Status extends EventEmitter {
    constructor(message, status) {
        super();
        this.message = message;
        this.state = status;
    }
}

module.exports = Status;