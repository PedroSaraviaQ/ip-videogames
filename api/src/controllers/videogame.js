const { Op } = require("sequelize");
const { Videogame, Genre } = require("../db");

module.exports = {
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
