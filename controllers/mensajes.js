const Mensaje = require("../models/mensaje");


const obtenerChat = async (req, res) => {

    const miId = req.uid;
    const mensajesDe = req.params.de;

    try {
        const last30 = await Mensaje.find({
            $or: [
                {de: miId, para: mensajesDe},
                {de: mensajesDe, para: miId},
            ]
        })
        .sort({ createdAt: 'asc' }).limit(100)
    
        res.json({
            ok: true,
            mensajes: last30,
        });
        
    } catch (e) {
        console.log(e);
        res.status(400).json({
            ok: false,
            msg: 'Error en la peticion al servidor',
        });
    }

}

module.exports = {
    obtenerChat
}