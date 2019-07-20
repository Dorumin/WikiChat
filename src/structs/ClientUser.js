const User = require('./User');
const Collection = require('./Collection');

class ClientUser extends User {
    constructor(name, client) {
        super(name, client);
        this.blocks = new Collection();
        this.blockedBy = new Collection();
    }

    async fetchPrivateBlocks() {
        const { blockedChatUsers, blockedByChatUsers } = await this.client.http.get('https://dev.fandom.com/index.php', {
            query: {
                action: 'ajax',
                rs: 'ChatAjax',
                method: 'getPrivateBlocks',
                NONCE: Date.now()
            }
        });
        blockedChatUsers.forEach(name => this.blocks.set(name, new User(name, this._client)));
        blockedByChatUsers.forEach(name => this.blockedBy.set(name, new User(name, this._client)));
    }
}

module.exports = ClientUser;