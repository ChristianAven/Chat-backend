/*
    path: localhost:8080/api/login/
*/
const { Router } = require('express');
const { check }  = require('express-validator');
//controladores
const { crearUsuario, login, renewToken } = require('../controllers/auth');
// middlewares
const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');

const router = Router();

// Crear nuevos usuarios
router.post('/new', [
    check('nombre', 'El nombre es obligatorio').isString().notEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').isString().not().isEmpty(),
    validarCampos,    
] ,crearUsuario);

// Login
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos,
] ,login );

// renovar token
router.get('/renew',[validarJWT],renewToken );


module.exports = router;