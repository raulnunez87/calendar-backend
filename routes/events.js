/*
    Events Routes / Events
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { fieldValidation } = require('../middlewares/fieldValidation');
const { getEvents, addNewEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validJWT } = require('../middlewares/validJWT');

const router = Router();

// Todas tienen que pasar po la validación del JWT
router.use( validJWT );

// Obtener eventos
router.get( '/', getEvents ); 

// Crear un nuevo evento
router.post(
    '/', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        fieldValidation
    ], 
    addNewEvent 
); 

// Actualizar evento
router.put(
    '/:id', 
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        fieldValidation
    ], 
    updateEvent 
); 

// Eliminar evento
router.delete('/:id', deleteEvent); 

module.exports = router;