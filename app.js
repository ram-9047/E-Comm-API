const express = require("express");
const app = express();

//setting view engine
app.set("view engine", "ejs");
app.set("views", "views");

// dependencies import
const path = require("path");
const bodyParser = require("body-parser");

// utils
const errorController = require("./controllers/error");
const sequelize = require("./util/database");

// routes import
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//models import
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const Cart_Item = require("./models/cart-item");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => err, "error in finding user");
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// database relations

// a product belongs to a specific user/ adminUser
Product.belongsTo(User, { constaints: true, onDelete: "CASCADE" });

//one user can have many product
User.hasMany(Product);

// a user can have only one cart
User.hasOne(Cart);
Cart.belongsTo(User);

// a cart can have multiple products
Cart.belongsToMany(Product, { through: Cart_Item });

// a single product can be a part of multiple cart
Product.belongsToMany(Cart, { through: Cart_Item });

const port = 3000 || process.env.PORT;
sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((user) => {
    // console.log(user, "user created");
    app.listen(port, () => {
      console.log("database connected");
      console.log(`server is started at port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err, "error");
  });
