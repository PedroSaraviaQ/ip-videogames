require("dotenv").config();
const { API_KEY } = process.env;
const { Genre } = require("../db");
const axios = require("axios");

module.exports = {
  getGenres: async (req, res) => {
    try {
      // Retrieves the genres from the API and selects only their names
      let genre_names = (await axios.get(`/genres?key=${API_KEY}`)).data.results.map((genre) => genre.name);
      // Inserts the genres in the database and then retrieves them
      await Promise.all(
        genre_names.map((name) =>
          Genre.findOrCreate({
            where: { name },
          })
        )
      );
      res.send(await Genre.findAll());
    } catch (err) {
      res.send(err);
    }
  },
};
