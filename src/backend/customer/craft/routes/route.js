const express = require("express");
const authRoutes = require("./auth/auth.routes.js");
const productRoutes = require("./product/product.routes.js");
const shopRoutes = require("./inventory/shop.routes.js");
//const orderRoutes = require("./order/order.routes.js");
const userRoutes = require("./user/user.route.js");


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/shop", shopRoutes);
//router.use("/orders", orderRoutes);
router.use("/user", userRoutes);

module.exports = router;
