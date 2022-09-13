const supertest = require("supertest");
const app = require("../../src/app");
const { conn, Videogame, Genre } = require("../../src/db");

const request = supertest(app);

describe("Videogame routes", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(async () => {
    await conn.sync({ force: true });
    await request.get("/genres");
    await request.post("/videogames").send({
      data: {
        name: "Super Mario Bros: Pan",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
        image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
      },
      genres: ["Action", "Racing", "Puzzle"],
    });
  });

  describe("[] GET /videogames:", () => {
    it("should get 200", () => request.get("/videogames").expect(200));
    it("should return videogames from the API and the database", async () => {
      expect.assertions(5);
      return request.get("/videogames").then((res) => {
        expect(res.body.length).toBe(101);
        expect(res.body[1].name).toBe("The Witcher 3: Wild Hunt");
        expect(res.body[99].official).toBeTruthy();
        expect(res.body[100].genres).toContain("Puzzle");
        expect(res.body[100].official).toBeFalsy();
      });
    });
  });

  describe('[] GET /videogames?name="...":', () => {
    it("should return videogames from the API and the database", async () => {
      expect.assertions(5);
      return request.get("/videogames?name=bros").then((res) => {
        expect(res.body.length).toBe(101);
        expect(res.body[2].name).toBe("Mario Bros.");
        expect(res.body[99].official).toBeTruthy();
        expect(res.body[100].name).toContain("Super Mario Bros: Pan");
        expect(res.body[100].official).toBeFalsy();
      });
    });
    it("should also work when no videogames are found", async () => {
      expect.assertions(2);
      await request.get("/videogames?name=pan").then((res) => expect(res.body.length).toBe(71));
      await request.get("/videogames?name=qwampypolate").then((res) => expect(res.body).toEqual([]));
    });
  });

  describe("[] GET /videogames/{idVideogame}", () => {
    it("should throw an error if ID is invalid", () => {
      expect.assertions(1);
      return request.get("/videogames/si?official=true").then((res) => expect(res.status).toBe(400));
    });
    it("should throw an error if no videogame is found", async () => {
      expect.assertions(2);
      await request.get("/videogames/6243252?official=true").then((res) => expect(res.status).toBe(404));
      await request.get("/videogames/2?official=false").then((res) => expect(res.status).toBe(404));
    });
    it("should return a videogame from the API", async () => {
      expect.assertions(3);
      return request.get("/videogames/1320?official=true").then((res) => {
        expect(res.body.name).toBe("Dead Rising");
        expect(res.body.platforms[1]).toBe("PlayStation");
        expect(res.body.genres.length).toBe(1);
      });
    });
    it("should return a videogame from the database", async () => {
      expect.assertions(4);
      return request.get("/videogames/1?official=false").then((res) => {
        expect(res.body.name).toBe("Super Mario Bros: Pan");
        expect(res.body.platforms.length).toBe(2);
        expect(res.body.rating).toBe(7.8);
        expect(res.body.genres).toContain("Puzzle");
      });
    });
  });

  describe("[] POST /videogames:", () => {
    it("should throw an error if send data is invalid", () => {
      expect.assertions(1);
      return request
        .post("/videogames")
        .send({
          data: {
            name: [],
            description: "It is about something related",
            released: "2014-02-15",
            rating: 8.2,
            platforms: ["PC", "Xbox"],
            image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
          },
          genres: ["Action", "Racing", "Puzzle"],
        })
        .then(({ status }) => expect(status).toBe(400));
    });
    it("should throw an error if sent genres are invalid", () => {
      expect.assertions(1);
      return request
        .post("/videogames")
        .send({
          data: {
            name: "Spiderman 2",
            description: "It is about something related",
            released: "2014-02-15",
            rating: 8.2,
            platforms: ["PC", "Xbox"],
            image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
          },
          genres: ["Action", "Genre", "Puzzle"],
        })
        .then(({ status }) => expect(status).toBe(400));
    });
    it("should work if send data and genres are valid", async () => {
      await request.post("/videogames").send({
        data: {
          name: "Spiderman 2",
          description: "It is about something related",
          released: "2014-02-15",
          rating: 8.2,
          platforms: ["PC", "Xbox"],
          image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
        },
        genres: ["Adventure", "Sports"],
      });
      const videogames = await Videogame.findAll({ include: { model: Genre, through: { attributes: [] } } });
      expect(videogames[1].genres.map((g) => g.name)).toContain("Adventure");
      expect(videogames[0].name).toBe("Super Mario Bros: Pan");
    });
  });

  afterAll(async () => {
    await conn.sync({ force: true });
    await conn.close();
  });
});
