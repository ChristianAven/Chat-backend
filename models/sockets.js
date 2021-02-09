const { usuarioconectado,
        usuarioDesconectado,
        getUsuarios,
        grabarMensaje
    } = require("../controllers/sockets");

const { comprobarJWT } = require("../helpers/jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {

            const [ valido, uid ] = comprobarJWT(socket.handshake.query['x-token']);

            if(!valido){
                console.log('Socket no identificado');
                return socket.disconnect();
            }

            await usuarioconectado(uid);

            // Unir al usuario a una sala de socket.io
            socket.join( uid );

            // Saber que usuario esta activo mediante el UID

            // Emitir todos los usuarios conectados
            this.io.emit( 'list-usuarios', await getUsuarios() );


            // Escuchar cunado el cliente manda un mensaje
            socket.on('mensaje-personal', async(payload) =>{
                const mensaje = await grabarMensaje(payload);
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            })

            // Desconectar
            // Marcar en la base de datos que el usuario se desconecto
            
            socket.on('disconnect', async() => {
                await usuarioDesconectado(uid);
                this.io.emit( 'list-usuarios', await getUsuarios() )
            })
        
        });
    }


}


module.exports = Sockets;