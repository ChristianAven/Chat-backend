const { response } = require("express");
const Usuario      = require('../models/usuario')
const bcrypt       = require('bcryptjs');
const {generarJWT} = require("../helpers/jwt");

// Register
const crearUsuario = async(req, res = response) => {

    try {

        const { email, password } = req.body;

        // verificar que el email no exista
        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            });
        }
        
        const usuario = new Usuario(req.body);
        
        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt ) 

        // guardar usuario en bases de datos
        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token,
        });

        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Error no esperado'
        });
    };
    
}

// Login
const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        // Verificar si existe el email
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        };

        // validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'El password no es correcto'
            });
        };

        // Generar JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token,
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            ok: false,
            msg: 'Error no esperado'
        });
    }
};

// renovar token
const renewToken = async(req, res) => {

    const uid = req.uid;

    // Generar un nuevo JWT
    const token = await generarJWT(uid);

    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok:true,
        usuario,
        token,
    });
};



module.exports = {
    crearUsuario,
    login,
    renewToken,
};