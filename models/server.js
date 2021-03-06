// Servidor de Express
const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const cors     = require('cors');

const Sockets      = require('./sockets');
const dbConnection = require('../Database/config');

class Server {

    constructor() {

        this.app  = express();
        this.url = process.env.URL;

        // Conectar a DB
        dbConnection();
        // Http server
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { /* configuraciones */ } );
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );

        // cors
        this.app.use( cors() );

        // Paseo del body
        this.app.use( express.json() );

        //API ENDPoinsts
        this.app.use( '/api/login', require('../routers/auth') );
        this.app.use( '/api/mensajes', require('../routers/mensajes') );
    }

    // Esta configuración se puede tener aquí o como propieda de clase
    // depende mucho de lo que necesites
    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.url, () => {
            console.log('Server corriendo en puerto:', this.url );
        });
    }

}


module.exports = Server;