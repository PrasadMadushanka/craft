const express = require("express");
const router = express.Router();
const shopController = require("../../controllers/inventory/shop.controller.js");
const asyncHandler = require("../../middlewares/asyncHandler.middleware");

/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: Shop management endpoints
 */

/**
 * @swagger
 * /api/shop:
 *   get:
 *     summary: Get all shops
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShopFull'
 *
 * components:
 *   schemas:
 *     ShopFull:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         email: { type: string, example: "bhavindu@gmail.com" }
 *         mobile: { type: string, example: "94753602456" }
 *         address: { type: string, example: "101 Negombo Rd, Negombo, Sri Lanka" }
 *         image: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         description: { type: string, example: "description" }
 *         category: { type: string, example: "Sri Lankan" }
 *         opening_time: { type: string, example: "2025-05-30 08:00:00" }
 *         closing_time: { type: string, example: "2025-05-30 22:00:00" }
 *         shop_logo: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         banner: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         latitude: { type: string, example: "7.2084" }
 *         longitude: { type: string, example: "79.9766" }
 *         shop_name: { type: string, example: "Shop 01" }
 *         recommended: { type: integer, example: 1 }
 *         is_active: { type: boolean, example: true }
 *         shop_feedback:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               customer_id: { type: integer, example: 1 }
 *               order_id: { type: integer, example: 1 }
 *               rating: { type: integer, example: 5 }
 *               comment: { type: string, example: "good" }
 *               created_at: { type: string, format: date-time, example: "2025-05-08T15:28:35.000Z" }
 *         shop_category:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               category_id: { type: integer, example: 1 }
 *               category:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   name: { type: string, example: "Sri Lankan" }
 *                   description: { type: string, example: "Sri Lankan Foods" }
 *                   image: { type: string, example: "https://unsplash.com/photos/a-close-up-of-a-tray-of-food-on-a-table-OWGo0i0Evcc" }
 *         average_rating: { type: string, example: "4.00" }
 *         feedback_count: { type: integer, example: 2 }
 */
router.get("/", asyncHandler(shopController.findAll));

/**
 * @swagger
 * /api/shop/search:
 *   get:
 *     summary: Search shops
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token to authenticate the request
 *         required: true
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         description: Search text, can be part of shop name, address, category, etc.
 *     responses:
 *       200:
 *         description: List of matching shops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShopFull'
 *
 * components:
 *   schemas:
 *     ShopFull:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         email: { type: string, example: "bhavindu@gmail.com" }
 *         mobile: { type: string, example: "94753602456" }
 *         address: { type: string, example: "101 Negombo Rd, Negombo, Sri Lanka" }
 *         image: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         description: { type: string, example: "description" }
 *         category: { type: string, example: "Sri Lankan" }
 *         opening_time: { type: string, example: "2025-05-30 08:00:00" }
 *         closing_time: { type: string, example: "2025-05-30 22:00:00" }
 *         shop_logo: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         banner: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         latitude: { type: string, example: "7.2084" }
 *         longitude: { type: string, example: "79.9766" }
 *         shop_name: { type: string, example: "Shop 01" }
 *         recommended: { type: integer, example: 1 }
 *         is_active: { type: boolean, example: true }
 *         shop_feedback:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               customer_id: { type: integer, example: 1 }
 *               order_id: { type: integer, example: 1 }
 *               rating: { type: integer, example: 5 }
 *               comment: { type: string, example: "good" }
 *               created_at: { type: string, format: date-time, example: "2025-05-08T15:28:35.000Z" }
 *         shop_category:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               category_id: { type: integer, example: 1 }
 *               category:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   name: { type: string, example: "Sri Lankan" }
 *                   description: { type: string, example: "Sri Lankan Foods" }
 *                   image: { type: string, example: "https://unsplash.com/photos/a-close-up-of-a-tray-of-food-on-a-table-OWGo0i0Evcc" }
 *         average_rating: { type: string, example: "4.00" }
 *         feedback_count: { type: integer, example: 2 }
 */
router.get("/search", asyncHandler(shopController.search));

/**
 * @swagger
 * /api/shop/categories:
 *   get:
 *     summary: Shop categories
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shop categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShopCategory'
 *
 * components:
 *   schemas:
 *     ShopCategory:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         name: { type: string, example: "Sri Lankan" }
 *         description: { type: string, example: "Sri Lankan Foods" }
 *         image: { type: string, example: "https://unsplash.com/photos/a-close-up-of-a-tray-of-food-on-a-table-OWGo0i0Evcc" }
 */
router.get("/categories", asyncHandler(shopController.category));

/**
 * @swagger
 * /api/shop/special-offers:
 *   get:
 *     summary: Shop special offers
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: List of shop special offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShopSpecialOffer'
 *
 * components:
 *   schemas:
 *     ShopSpecialOffer:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         email: { type: string, example: "bhavindu@gmail.com" }
 *         mobile: { type: string, example: "94753602456" }
 *         address: { type: string, example: "101 Negombo Rd, Negombo, Sri Lanka" }
 *         image: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         shop_feedback:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               customer_id: { type: integer, example: 1 }
 *               order_id: { type: integer, example: 1 }
 *               rating: { type: integer, example: 5 }
 *               comment: { type: string, example: "good" }
 *               created_at: { type: string, format: date-time, example: "2025-05-08T15:28:35.000Z" }
 *         shop_promotion:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               promotion:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   title: { type: string, example: "New Year Offer" }
 *                   description: { type: string, example: "Get 15% off for New Year celebration!" }
 *                   code: { type: string, example: "NY2025" }
 *                   discount_type: { type: string, example: "PERCENT" }
 *                   discount_value: { type: string, example: "15" }
 *                   min_order_value: { type: string, example: "500" }
 *                   max_discount: { type: string, example: "200" }
 *                   start_date: { type: string, format: date-time, example: "2025-01-01T00:00:00.000Z" }
 *                   end_date: { type: string, format: date-time, example: "2025-01-10T23:59:59.000Z" }
 *                   is_active: { type: boolean, example: true }
 */
router.get("/special-offers", asyncHandler(shopController.specialOffers));

/**
 * @swagger
 * /api/shop/recommended:
 *   get:
 *     summary: Recommended shops
 *     tags: [Shops]
 *     responses:
 *       200:
 *         description: List of recommended shops
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ShopFull'
 *
 * components:
 *   schemas:
 *     ShopFull:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         email: { type: string, example: "bhavindu@gmail.com" }
 *         mobile: { type: string, example: "94753602456" }
 *         address: { type: string, example: "101 Negombo Rd, Negombo, Sri Lanka" }
 *         image: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         description: { type: string, example: "description" }
 *         category: { type: string, example: "Sri Lankan" }
 *         opening_time: { type: string, example: "2025-05-30 08:00:00" }
 *         closing_time: { type: string, example: "2025-05-30 22:00:00" }
 *         shop_logo: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         banner: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         latitude: { type: string, example: "7.2084" }
 *         longitude: { type: string, example: "79.9766" }
 *         shop_name: { type: string, example: "Shop 01" }
 *         recommended: { type: integer, example: 1 }
 *         is_active: { type: boolean, example: true }
 *         shop_feedback:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               customer_id: { type: integer, example: 1 }
 *               order_id: { type: integer, example: 1 }
 *               rating: { type: integer, example: 5 }
 *               comment: { type: string, example: "good" }
 *               created_at: { type: string, format: date-time, example: "2025-05-08T15:28:35.000Z" }
 *         shop_category:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               category_id: { type: integer, example: 1 }
 *               category:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   name: { type: string, example: "Sri Lankan" }
 *                   description: { type: string, example: "Sri Lankan Foods" }
 *                   image: { type: string, example: "https://unsplash.com/photos/a-close-up-of-a-tray-of-food-on-a-table-OWGo0i0Evcc" }
 *         average_rating: { type: string, example: "4.00" }
 *         feedback_count: { type: integer, example: 2 }
 */
router.get("/recommended", asyncHandler(shopController.recommended));

/**
 * @swagger
 * /api/shop/{id}:
 *   get:
 *     summary: Get shop by ID
 *     tags: [Shops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   $ref: '#/components/schemas/ShopFull'
 *       404:
 *         description: Shop not found
 *
 * components:
 *   schemas:
 *     ShopFull:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         email: { type: string, example: "bhavindu@gmail.com" }
 *         mobile: { type: string, example: "94753602456" }
 *         address: { type: string, example: "101 Negombo Rd, Negombo, Sri Lanka" }
 *         image: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         description: { type: string, example: "description" }
 *         category: { type: string, example: "Sri Lankan" }
 *         opening_time: { type: string, example: "2025-05-30 08:00:00" }
 *         closing_time: { type: string, example: "2025-05-30 22:00:00" }
 *         shop_logo: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         banner: { type: string, example: "https://your-bucket-name.s3.amazonaws.com/uploads/user123/avatar.png" }
 *         latitude: { type: string, example: "7.2084" }
 *         longitude: { type: string, example: "79.9766" }
 *         shop_name: { type: string, example: "Shop 01" }
 *         recommended: { type: integer, example: 1 }
 *         is_active: { type: boolean, example: true }
 *         shop_feedback:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               customer_id: { type: integer, example: 1 }
 *               order_id: { type: integer, example: 1 }
 *               rating: { type: integer, example: 5 }
 *               comment: { type: string, example: "good" }
 *               created_at: { type: string, format: date-time, example: "2025-05-08T15:28:35.000Z" }
 *         shop_category:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: integer, example: 1 }
 *               category_id: { type: integer, example: 1 }
 *               category:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   name: { type: string, example: "Sri Lankan" }
 *                   description: { type: string, example: "Sri Lankan Foods" }
 *                   image: { type: string, example: "https://unsplash.com/photos/a-close-up-of-a-tray-of-food-on-a-table-OWGo0i0Evcc" }
 *         average_rating: { type: string, example: "4.00" }
 *         feedback_count: { type: integer, example: 2 }
 */
router.get("/:id", asyncHandler(shopController.findOne));

/**
 * @swagger
 * /api/shop/delivery/calculate-fee:
 *   post:
 *     summary: Calculate delivery fee
 *     tags: [Shops]
 *     description: Calculate the delivery fee based on shop and customer location.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shopId
 *               - latitude
 *               - longitude
 *             properties:
 *               shopId:
 *                 type: integer
 *                 example: 1
 *               latitude:
 *                 type: number
 *                 example: 7.2084
 *               longitude:
 *                 type: number
 *                 example: 79.9766
 *     responses:
 *       200:
 *         description: Delivery fee calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 deliveryFee:
 *                   type: number
 *                   example: 120
 *       406:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 406
 *                 message:
 *                   type: string
 *                   example: shopId, latitude, and longitude are required
 */
router.post("/delivery/calculate-fee", asyncHandler(shopController.calculateDeliveryFee));

module.exports = router;