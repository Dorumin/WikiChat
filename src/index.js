module.exports = {
    // Main export
    Client: require('./client/Client'),
    
    // Structures
    Session: require('./client/Session'),
    Chat: require('./structs/Chat'),
    ChatEntry: require('./structs/ChatEntry'),
    ChatUser: require('./structs/ChatUser'),
    ClientUser: require('./structs/ClientUser'),
    Collection: require('./structs/Collection'),
    InitQuery: require('./structs/InitQuery'),
    InlineAlert: require('./structs/InlineAlert'),
    Message: require('./structs/Message'),
    Room: require('./structs/Room'),
    Socket: require('./structs/Socket'),
    Status: require('./structs/Status'),
    User: require('./structs/User'),

    // Handy stuff for the sake of completion
    HTTPClient: require('./http/HTTPClient')
};