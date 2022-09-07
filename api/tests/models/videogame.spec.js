const { Videogame, conn } = require("../../src/db.js");

describe("Videogame model", () => {
  beforeAll(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() => Videogame.sync({ force: true }));

  describe("Name", () => {
    it("should throw an error if name is null", () => {
      expect.assertions(1);
      return Videogame.create({
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      }).catch((err) => expect(err).toBeDefined());
    });
    it("should work when it's a valid name", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      }).then((data) => expect(data).toBeDefined());
    });
    it("should throw an error if name is repeated", async () => {
      expect.assertions(1);
      await Videogame.create({
        name: "God of War",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      });
      await Videogame.create({
        name: "God of War",
        description: "It is about something related",
        released: "2013-09-25",
        rating: 7.9,
        platforms: ["PC", "Xbox"],
      }).catch((err) => expect(err).toBeDefined());
    });
  });

  describe("Description", () => {
    it("should throw an error if description is null", () => {
      expect.assertions(1);
      return Videogame.create({ name: "Aircraft", released: "2013-09-24", rating: 7.8, platforms: ["PC", "Xbox"] }).catch((err) =>
        expect(err).toBeDefined()
      );
    });
    it("should work when it's a valid description", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      }).then((data) => expect(data).toBeDefined());
    });
  });

  describe("Released", () => {
    it("should throw an error if date is invalid", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "somedates",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      }).catch((err) => expect(err).toBeDefined());
    });
    it("should work when it's a valid date", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      }).then((data) => expect(data).toBeDefined());
    });
  });

  describe("Rating", () => {
    it("should throw an error if rating is invalid", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: [],
        platforms: ["PC", "Xbox"],
      }).catch((err) => expect(err).toBeDefined());
    });
    it("should work when it's a valid rating", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      }).then((data) => expect(data).toBeDefined());
    });
  });

  describe("Platforms", () => {
    it("should throw an error if platforms are invalid", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", []],
      }).catch((err) => expect(err).toBeDefined());
    });
    it("should work when they're valid platforms", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
      }).then((data) => expect(data).toBeDefined());
    });
  });

  describe("Image", () => {
    it("should throw an error if URL is invalid", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
        image: "an-image",
      }).catch((err) => expect(err).toBeDefined());
    });
    it("should work when it's a valid URL", () => {
      expect.assertions(1);
      return Videogame.create({
        name: "Super Mario Bros",
        description: "It's about something related",
        released: "2013-09-24",
        rating: 7.8,
        platforms: ["PC", "Xbox"],
        image: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
      }).then((data) => expect(data).toBeDefined());
    });
  });

  afterAll(async () => {
    await Videogame.sync({ force: true });
    await conn.close();
  });
});
