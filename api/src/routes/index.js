const { Router } = require("express");
const axios = require("axios");
axios.defaults.baseURL = "https://api.rawg.io/api";
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
