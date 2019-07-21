const EventEmitter = require('events').EventEmitter;
const Collection = require('./Collection');

class User extends EventEmitter {
    constructor(name, client) {
        super();
        this.client = client;
        this.name = name;
        this.chats = new Collection();
        this.userId = null;
        this.registrationDate = null;
    }

    resolvable() {
        let resolve,
        promise = new Promise(res => resolve = res);

        promise.resolve = resolve;

        return promise;
    }

    async getRegistration() {
        if (this.registrationDate) return await this.registrationDate;
        this.registrationDate = this.resolvable();

        const { query } = await this.client.http.get('https://community.fandom.com/api.php', {
            query: {
                action: 'query',
                list: 'users',
                ususers: this.name,
                usprop: 'registration',
                format: 'json'
            }
        });

        console.log(query);
    }

    parseAvatar(url) {
        return url.replace('.nocookie.net', '.com').replace(/\/scale-to-width-down\/\d+/, '');
    }

    checkDelete(obj, prop, selfProp, compare) {
        if (compare) {
            if (compare(obj[prop], this[selfProp])) {
                delete obj[prop];
            }
        } else if (obj[prop] == this[selfProp]) {
            delete obj[prop];
        }
    }

    update(attrs) {
        const check = this.checkDelete.bind(this, attrs);
        check('name', 'name');
        check('since', 'since', (cur, old) => !cur || cur['0'] * 1000 == old.getTime());
        check('statusMessage', 'status', (cur, old) => cur == old.message);
        check('statusState', 'status', (cur, old) => cur == old.state);
        check('isModerator', 'isModerator');
        check('canPromoteModerator', 'canPromoteModerator');
        check('isStaff', 'isStaff');
        check('groups', 'groups', (cur, old) => cur.join('|') == old.join('|'));
        check('avatarSrc', 'avatar', (cur, old) => this.parseAvatar(cur) == old);
        check('editCount', 'edits');
        // check('privateRoomId', 'privateRoom', (cur, old) => old && old.id == cur);
        delete attrs.isPrivate;
        delete attrs.privateRoomId;
        delete attrs.active;

        const props = Object.getOwnPropertyNames(attrs);
        let i = props.length;

        if (i === 0) return;
        console.log(attrs);

        while (i--) {
            const prop = props[i],
            val = attrs[prop];

            switch (prop) {
                case 'statusMessage':
                    this.status.message = val;
                    break;
                case 'statusState':
                    this.status.state = val;
                    break;
                case 'avatarSrc':
                    console.log('Updated avatar');
                    this.avatar = this.parseAvatar(attrs.avatarSrc);
                    break;
                case 'since':
                    console.log('Updated since');
                    console.log(val);
                    console.log(this.since);
                default:
                    console.log('Uncaught user attribute change', prop, val);
            }
        }

        this.emit('updateUser', this, attrs);
    }
}

module.exports = User;