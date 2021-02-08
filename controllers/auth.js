const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        user = new User( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        // if (name.length < 5) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'El nombre debe ser de 5 letras'
        //     });
        // }

        // Manejo de errores
        // const errors = validationResult( req );

        // if ( !errors.isEmpty() ) {
        //     return res.status(400).json({
        //         ok: false,
        //         errors: errors.mapped()
        //     });
        // }

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });        
    }

}

const loginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o contraseña no coinciden.'
            });
        }

        // Confirmar los passwords

        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o la contraseña no coinciden.'
            });
        }

        // Generar nuestro JWT
        const token = await generateJWT( user.id, user.name );

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token 
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });  
    }

}

const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    // generar un nuevo JWT y retornarlo en esta petición
    const token = await generateJWT( uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });

}

module.exports = {
    createUser,
    loginUser,
    renewToken
}