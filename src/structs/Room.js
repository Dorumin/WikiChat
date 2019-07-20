// TODO: everything, ditinguish in declaration and usage Room from Chat
const EventEmitter = require('events').EventEmitter;
const Collection = require('./Collection');
const Socket = require('./Socket');
const Message = require('./Message');

class Room extends EventEmitter {
    constructor(id, chat) {
        super();
        this.chat = chat;

        this.roomId = id || chat.roomId;
        this.isPrivate = id !== null && id !== chat.roomId;
        console.log(id, chat.roomId, this.isPrivate);

        this.users = new Collection();
        this.messages = new Collection();
        this.pendingMessages = new Collection();

        this.socket = this.createSocket();
    }

    async connect() {
        console.log('Called connect');
        await this.socket.connect();
    }

    createSocket() {
        const socket = new Socket(this);
        socket.on('join', this.onJoin.bind(this));
        socket.on('leave', this.onLeave.bind(this));
        socket.on('message', this.onMessage.bind(this));
        socket.on('updateUser', this.onUpdateUser.bind(this));
        socket.on('openPrivateRoom', this.onOpenPrivateRoom.bind(this));
        return socket;
    }

    async send(text) {
        await this.socket._ready;
        this.socket.send(
            new Message({
                text,
                name: this.chat.client.user.name,
                roomId: this.roomId
            },
            this,
            this.users.get(this.chat.client.user.name))
        );
    }

    onJoin(user) {
        this.users.set(user.name, user);
        this.emit('join', user);
    }

    onLeave(user) {
        this.users.delete(user.name);
        this.emit('leave', user);
    }

    onMessage(message) {
        this.messages.set(message.id, message);
        this.emit('message', message);
        if (this.isPrivate) {
            this.emit('message.private', message);
        }
        if (message.self) {
            this.emit('message.self', message);
        }
    }

    onUpdateUser(user) {
        this.emit('updateUser', user);
    }

    onOpenPrivateRoom(room) {
        this.emit('room', room);
        this.emit('room.private', room);
    }
}

module.exports = Room;