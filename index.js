const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const productsRoute = require("./routes/products");
const cartsRoute = require("./routes/carts");
const ordersRoute = require("./routes/orders");
const stripeRoute = require("./routes/stripe");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/checkout", stripeRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on PORT:${PORT}`));
  })
  .catch((err) => console.log(err.message));
