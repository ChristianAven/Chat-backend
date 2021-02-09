/*
    url: localhost:8080/api/mensajes/ABC
*/

const { Router }      = require('express');
const { obtenerChat } = require('../controllers/mensajes');
const validarJWT      = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:de', validarJWT, obtenerChat);



module.exports = router;