const supertest = require("supertest");
const app = require("../../src/app");
const { conn, Genre } = require("../../src/db");

const request = supertest(app);

describe("Genre routes", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() => Genre.sync({ force: true }));

  describe("[] GET /genres:", () => {
    it("should get 200", () => request.get("/genres").expect(200));

    it("should return all genres", () => {
      expect.assertions(2);
      return request.get("/genres").then((res) => {
        expect(res.body.length).toBe(19);
        expect(res.body.map((e) => e.name)).toContain("Platformer");
      });
    });

    it("should store the genres in the database", async () => {
      expect((await Genre.findAll()).length).toBe(0);
      await request.get("/genres");
      expect((await Genre.findAll()).length).toBe(19);
    });
  });

  afterAll(async () => {
    await Genre.sync({ force: true });
    await conn.close();
  });
});
