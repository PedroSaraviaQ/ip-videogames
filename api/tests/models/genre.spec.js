const { Genre, conn } = require("../../src/db.js");

describe("Genre model", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() => Genre.sync({ force: true }));

  describe("Name", () => {
    it("should throw an error if name is null", () => {
      expect.assertions(1);
      return Genre.create({}).catch((err) => expect(err).toBeDefined());
    });
    it("should work when it's a valid name", () => {
      expect.assertions(1);
      return Genre.create({ name: "Adventure" }).then((data) => expect(data).toBeDefined());
    });
    it("should throw an error if name is repeated", async () => {
      expect.assertions(1);
      await Genre.create({ name: "Shooter" });
      await Genre.create({ name: "Shooter" }).catch((err) => expect(err).toBeDefined());
    });
  });

  afterAll(async () => {
    await Genre.sync({ force: true });
    await conn.close();
  });
});
