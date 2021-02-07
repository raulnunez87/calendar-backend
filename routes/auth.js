/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidation } = require('../middlewares/fieldValidation');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validJWT } = require('../middlewares/validJWT');

const router = Router();

router.post(
    '/new', 
    [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidation
    ], 
    createUser
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidation
    ], 
    loginUser
);

router.get('/renew', validJWT, renewToken);

module.exports = router;