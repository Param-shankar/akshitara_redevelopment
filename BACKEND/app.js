const express = require("express");
const productRoute = require("./routes/product.route");
const userRoute = require("./routes/user.route");
const orderRoute = require("./routes/order.route");
const cartRoute = require("./routes/cart.route");
const wishlistRoute = require("./routes/wishlist.route");
const categoryRoute = require("./routes/category.route");
const authRoute = require("./routes/auth.router");
const paymentRoute = require("./routes/payment.route");
const consultingRoute = require("./routes/consultation.router");
const reviewRoute = require("./routes/review.route");
const blogRoute = require("./routes/blog.router");
const customizedOrderRoute = require("./routes/customizedOrder.router");
const app = express();
const cors = require("cors");

require("dotenv").config();
const PORT = 4000 || process.env.PORT;

require("dotenv").config();
require("./utils/dbconnection");

/*MIDDLEWARE*/
app.use(
  cors({
    origin: ["http://localhost:3000"], // allowed origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
    credentials: true, // if you want to allow cookies/auth headers
  })
);

app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

/*  */
app.get("/", (req, res) => {
  res.send("Hello from node API. This is home page");
});

/*ROUTES*/
app.use("/api/auth", authRoute);

app.use("/api/products", productRoute);

app.use("/api/users", userRoute);

app.use("/api/orders", orderRoute);

app.use("/api/cart", cartRoute);

app.use("/api/category", categoryRoute);

app.use("/api/payments", paymentRoute);

app.use("/api/consulting", consultingRoute);

app.use("/api/reviews", reviewRoute);

app.use("/api/blogs", blogRoute);

app.use("/api/customizedOrder", customizedOrderRoute);

app.listen(PORT, () => {
  console.log("Server is running on port 4000");
});
