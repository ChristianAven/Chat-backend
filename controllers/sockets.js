const Usuario = require('../models/usuario');
const Mensaje = require('../models/mensaje');

const usuarioconectado = async(uid) => {

    const usuario = await Usuario.findById(uid);
    usuario.online = true;
    await usuario.save();

    return usuario;

}

const usuarioDesconectado = async(uid) => {

    const usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();

    return usuario;

}

const getUsuarios = async() => {

    const usuarios = await Usuario.find().sort('-online');

    return usuarios;

}

const grabarMensaje = async(payload) => {

    try {

        const mensaje = new Mensaje(payload);
        await mensaje.save();

        return mensaje;
        
    } catch (er) {
        console.log(er);
        return false;
    }

}



module.exports = {
    usuarioconectado,
    usuarioDesconectado,
    getUsuarios,
    grabarMensaje,
}