class MediaWikiMessage {
    constructor(key, value, params) {
        this.format = 'plain';
        this.key = key;
        this.value = value;
        this.params = params;
    }

    plain() {
        this.format = 'plain';
        return this.toString();
    }

    escaped() {
        this.format = 'escaped';
        return this.toString();
    }

    

    exists() {
        return this.value !== null;
    }
}

module.exports = MediaWikiMessage;