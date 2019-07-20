const Collection = require('./Collection');
const MediaWikiMessage = require('./MediaWikiMessage');

class MediaWikiMessageCollection extends Collection {
    get(key, ...params) {
        return new MediaWikiMessage(key, this.get(key), params);
    }
}

module.exports = MediaWikiMessageCollection;