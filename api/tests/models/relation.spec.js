const { Videogame, Genre, Relation, conn } = require("../../src/db.js");

describe("Relation model", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(async () => {
    await conn.sync({ force: true });
    await Genre.create({ name: "Action" });
    await Genre.create({ name: "Puzzle" });
    await Genre.create({ name: "Fighting" });
    await Genre.create({ name: "Sports" });
    await Genre.create({ name: "Racing" });
  });

  it("should add nothing if genres aren't provided", async () => {
    const videogame = await Videogame.create({
      name: "Super Mario Bros",
      description: "It's about something related",
      released: "2013-09-24",
      rating: 7.8,
      platforms: ["PC", "Xbox"],
      image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
    });
    await videogame.setGenres([]);
    let relation = await Relation.findAll();
    expect(relation.length).toBe(0);
  });

  it("should throw an error if genres are invalid", async () => {
    expect.assertions(2);
    const videogame = await Videogame.create({
      name: "Super Mario Bros",
      description: "It's about something related",
      released: "2013-09-24",
      rating: 7.8,
      platforms: ["PC", "Xbox"],
      image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
    });
    await videogame.setGenres(["Action", "PS4"]).catch((err) => expect(err.message).toBeDefined());
    expect((await Relation.findAll()).length).toBe(0);
  });

  it("should work when provided temperaments are available", async () => {
    const videogame = await Videogame.create({
      name: "Super Mario Bros",
      description: "It's about something related",
      released: "2013-09-24",
      rating: 7.8,
      platforms: ["PC", "Xbox"],
      image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
    });
    await videogame.setGenres([2, 5, 4]);
    const relation = await Relation.findAll();
    expect(relation.length).toBe(3);
    expect(relation[1].genreId).toBe(5);
    // Search for videogames including their genres
    const videogames = (
      await Videogame.findAll({
        attributes: ["name"],
        include: {
          model: Genre,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      })
    ).map((videogame) => ({
      ...videogame,
      genres: videogame.genres.map((t) => t.name),
    }));
    expect(videogames[0].genres[2]).toBe("Sports");
  });

  afterAll(async () => {
    await conn.sync({ force: true });
    await conn.close();
  });
});
