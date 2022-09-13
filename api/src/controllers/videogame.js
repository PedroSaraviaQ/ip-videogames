const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;
const { Op } = require("sequelize");
const { Videogame, Genre } = require("../db");

module.exports = {
  getVideogames: async (req, res) => {
    const { name } = req.query;
    // some conditions if name exists
    const nameQueries = name ? `search=${name}&search_precise=true&` : "";
    const where = name ? { name: { [Op.iLike]: `%${req.query.name}%` } } : {};
    //
    try {
      const pages = [1, 2, 3, 4, 5];
      // will retrieve videogames from the API
      const apiVideogames = pages.map((i) =>
        axios.get(`/games?${nameQueries}key=${API_KEY}&page=${i}`).then(
          (res) =>
            res.data.results.map((vg) => ({
              name: vg.name,
              genres: vg.genres.map((g) => g.name),
              image: vg.background_image,
              official: true,
            })),
          () => []
        )
      );
      //
      // will retrieve videogames from the database
      const dbVideogames = Videogame.findAll({ where, include: Genre }).then((data) =>
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
      res.status(400).send(err);
    }
  },

  getVideogameById: async (req, res) => {
    const { id } = req.params;
    const { official } = req.query;
    try {
      if (isNaN(Number(id))) throw new Error("Id must be a valid number");
      // retrieves a videogame from the API and sends it
      if (official === "true") {
        return axios.get(`/games/${id}?key=${API_KEY}`).then(
          ({ data }) => {
            const videogame = {
              name: data.name,
              description: data.description,
              released: data.released,
              rating: data.rating,
              platforms: data.parent_platforms.map((p) => p.platform.name),
              image: data.background_image,
              genres: data.genres.map((g) => g.name),
            };
            res.send(videogame);
          },
          () => res.status(404).send("Id not found")
        );
      }
      //
      // retrieves a videogame from the database and sends it
      const videogame = await Videogame.findOne({ where: { id }, include: Genre });
      if (!videogame) return res.status(404).send("Id not found");
      res.send({ ...videogame.toJSON(), genres: videogame.genres.map((g) => g.name) });
      //
    } catch (err) {
      res.status(400).send(err);
    }
  },

  postVideogame: async (req, res) => {
    const { data, genres } = req.body;
    try {
      // looks for missing inputs or invalid genres
      if (!data.name || !data.description) throw new Error("Some inputs are required");
      const dbGenres = await Genre.findAll({ where: { name: { [Op.in]: genres } } });
      if (genres.length !== dbGenres.length) throw new Error("Insert valid genres");
      //
      await (await Videogame.create(data)).setGenres(dbGenres);
      res.sendStatus(200);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};
