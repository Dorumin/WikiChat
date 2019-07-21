# I'm bad at naming
Library for interfacing with wikia's Special:Chat extension. Better, faster, stronger than chatbot-rb.

```
yarn add wikichat
```
```
npm install wikichat
```


## Examples
```js
const { Client } = require('wikichat');

const client = new Client({
    username: 'Username',
    password: 'Password',
    chats: [
        'dev',
        'doru'
    ]
}); 

client.on('ready', () => {
    client.chats.get('dev').room.send('Connected successfully to all chats');
    client.chats.get('dev').room.send(`Currently connected to ${clients.chats.size} chats: ${
        client.chats.array()
            .map(chat => chat.name)
            .join(', ')
    }`);
});

client.on('room.main', room => {
    room.send('Hello!');
});

client.on('message', message => {
    if (message.self) {
        // Sent from our account; ignore
        return;
    }

    if (message.text === '!ping') {
        message.room.send('Pong!');
    }
});

client.on('room.private', room => {
    room.send('Hello, what can I help you with?');
});
```

## Events
### message(message)
Emitted when a message is received, in any room, after the bot has connected.
#### message.private(message)
Emitted when a message is received on a private room
Does NOT fire when the message is sent before the room was opened, e.g. opened from another triggered by a message send
You will need to use room.private to fetch the existing backlog messages

### join(user)
Emitted when a user joins a main chat, not fired on private rooms

### leave(user)
Emitted when a user leaves chat, not fired on private rooms
Fires 45 seconds after a `part` socket event, or 10 seconds after a `logout` socket event, to comply with Special:Chat

### updateUser(user, attrs)
Emitted when a user updates, either by leaving then joining chat, or updating their status.
`attrs` is a plain object containing all the changed attributes. Might make it a collection someday.

### room(room)
Emitted when the bot joins a room
### room.main(room)
Emitted when the bot joins a main chat room
### room.private(room)
Emitted when the bot joins a private room