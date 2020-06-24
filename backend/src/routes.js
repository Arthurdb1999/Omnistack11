const express = require('express')
const { celebrate, Segments, Joi } = require('celebrate')

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

const OngCreateValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
    })
}

const ProfileIndexValidation = {
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}

const IncidentValidation = {
    delete: {
        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
        })
    },
    index: {
        [Segments.QUERY]: Joi.object().keys({
            page: Joi.number()
        })
    },
    create: {
        [Segments.HEADERS]: Joi.object({
            authorization: Joi.string().required()
        }).unknown(),
        [Segments.BODY]: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            value: Joi.number().required()
        })
    }
}

routes.post('/sessions', SessionController.create)

routes.get('/ongs', OngController.index);
routes.post('/ongs', celebrate(OngCreateValidation), OngController.create);

routes.get('/profile', celebrate(ProfileIndexValidation), ProfileController.index);

routes.post('/incidents', celebrate(IncidentValidation.create), IncidentController.create);
routes.get('/incidents', celebrate(IncidentValidation.index), IncidentController.index);
routes.delete('/incidents/:id', celebrate(IncidentValidation.delete), IncidentController.delete);


module.exports = routes;