const { Router } = require("express");
const axios = require("axios");
axios.defaults.baseURL = "https://api.rawg.io/api";

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const { getGenres } = require("../controllers/genre");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/genres", getGenres);

module.exports = router;
