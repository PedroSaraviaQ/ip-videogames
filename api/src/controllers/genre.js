require("dotenv").config();
const { API_KEY } = process.env;
const { Genre } = require("../db");
const axios = require("axios");

module.exports = {
  getGenres: async (req, res) => {
    try {
      // retrieves the genres from the API
      const apiGenres = (await axios.get(`/genres?key=${API_KEY}`)).data.results;
      // tries to insert the genres in the database, then sends them all
      const createGenres = ({ name }) => Genre.findOrCreate({ where: { name } });
      await Promise.all(apiGenres.map(createGenres));
      res.send(await Genre.findAll({ attributes: ["name"] }));
    } catch (err) {
      console.log(err.message);
      res.status(400).send(err);
    }
  },
};
