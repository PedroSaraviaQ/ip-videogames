const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;
const { Op } = require("sequelize");
const { Videogame, Genre } = require("../db");

module.exports = {
  getVideogames: async (req, res) => {
    try {
      const pages = [1, 2, 3, 4, 5];
      // will retrieve videogames from the API
      const apiVideogames = pages.map((i) =>
        axios.get(`/games?key=${API_KEY}&page=${i}`).then((res) =>
          res.data.results.map((vg) => ({
            name: vg.name,
            genres: vg.genres.map((g) => g.name),
            image: vg.background_image,
            official: true,
          }))
        )
      );
      //
      // will retrieve videogames from the database
      const dbVideogames = Videogame.findAll({ include: Genre }).then((data) =>
        data.map((vg) => ({
          name: vg.name,
          genres: vg.genres.map((g) => g.name),
          image: vg.image,
        }))
      );
      //
      // retrieves all videogames and sends them
      let total = await Promise.all([...apiVideogames, dbVideogames]);
      total = total.reduce((all, group) => [...all, ...group], []);
      res.send(total);
      //
    } catch (err) {
      console.log(err.message);
      res.status(404).send(err);
    }
  },
  postVideogame: async (req, res) => {
    const { data, genres } = req.body;
    try {
      if (!data.name || !data.description) throw new Error("Some inputs are required");
      const dbGenres = await Genre.findAll({ where: { name: { [Op.in]: genres } } });
      if (genres.length !== dbGenres.length) {
        throw new Error("Insert valid genres");
      }
      await (await Videogame.create(data)).setGenres(dbGenres);
      res.sendStatus(200);
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
