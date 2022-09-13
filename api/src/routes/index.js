const { Router } = require("express");
const axios = require("axios");
axios.defaults.baseURL = "https://api.rawg.io/api";

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const { getVideogames, getVideogameById, postVideogame } = require("../controllers/videogame");
const { getGenres } = require("../controllers/genre");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/videogames", getVideogames);
router.get("/videogames/:id", getVideogameById);
router.post("/videogames", postVideogame);
router.get("/genres", getGenres);

module.exports = router;
