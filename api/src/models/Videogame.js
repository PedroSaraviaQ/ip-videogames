const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("videogame", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    released: {
      type: DataTypes.DATEONLY,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    // To fix: default value for errors
    image: {
      type: DataTypes.TEXT,
      defaultValue: "https://t3.ftcdn.net/jpg/02/80/94/76/360_F_280947621_U7mDimuN41KHdMfvt3aIqd0OgXh7RAzm.jpg",
      validate: {
        isUrl: true,
      },
    },
  });
};
