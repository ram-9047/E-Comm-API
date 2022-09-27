const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Cart_Item = sequelize.define("cartItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  quantity: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Cart_Item;
