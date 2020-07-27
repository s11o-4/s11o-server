//Aqui defino la logica del cliente que se va a comunicar con el servidor
const io = require('socket.io-client');

let socket = io.connect('http://localhost:3000', {reconnect: true});// Primer arguemnto el server y el sefundo argumento el json de config. EN este caso coloque que quierp que se reconecte en caso de que se reconecte

//La socket tiene un evento connect q se ejecuta cuando la conexion con web sockets finalizo correctamente
socket.on('connect', function(){//Evento connect
    console.log("\n\nSocket connected from NodeJS\n\n")
})

module.exports = socket;//Exporto la socket