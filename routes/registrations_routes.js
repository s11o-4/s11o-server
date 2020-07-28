// Voy a definir dos rutas una para mostrar los registros y otra para modificarlos

const express = require('express');

let RegistrationsController = require('../controllers/registrations');
let router = express.Router();

router.get('/signup',RegistrationsController.new) // ejecuta el metodo new

router.route('/users').post(RegistrationsController.create)

module.exports = router; // Exporto mi nuevo router