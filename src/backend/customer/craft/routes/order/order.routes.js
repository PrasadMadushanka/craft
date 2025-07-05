const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/order/order.controller");
const asyncHandler = require("../../middlewares/asyncHandler.middleware");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management operations for drivers
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *           example: Bearer <your_access_token>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - shop_id
 *               - food
 *               - delivery_fee
 *               - type
 *               - status
 *               - address
 *               - street_or_apartment_no
 *               - delivery_instruction
 *               - spatial_instruction
 *               - latitude
 *               - longitude
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               shop_id:
 *                 type: integer
 *                 example: 1
 *               food:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - quantity
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     variantId:
 *                       type: integer
 *                       example: 1
 *               delivery_fee:
 *                 type: integer
 *                 example: 50
 *               type:
 *                 type: string
 *                 example: "COD"
 *               status:
 *                 type: string
 *                 example: "PLACED"
 *               address:
 *                 type: string
 *                 example: "123 Main Street"
 *               street_or_apartment_no:
 *                 type: string
 *                 example: "Apt 4B"
 *               delivery_instruction:
 *                 type: string
 *                 example: "Leave at the door"
 *               spatial_instruction:
 *                 type: string
 *                 example: "Near the blue mailbox"
 *               latitude:
 *                 type: number
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 example: -74.006
 *           example:
 *             customer_id: 1
 *             shop_id: 1
 *             food:
 *               - id: 1
 *                 quantity: 2
 *                 variantId: 1
 *               - id: 2
 *                 quantity: 1
 *             delivery_fee: 50
 *             type: "COD"
 *             status: "PLACED"
 *             address: "123 Main Street"
 *             street_or_apartment_no: "Apt 4B"
 *             delivery_instruction: "Leave at the door"
 *             spatial_instruction: "Near the blue mailbox"
 *             latitude: 40.7128
 *             longitude: -74.006
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   example: Order placed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 */
router.post("/", asyncHandler(orderController.save));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
*       - in: header    
*         name: Authorization
*         required: true        
*         description: Bearer token
*         schema:
*           type: string
*           example: Bearer <your_access_token>
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", asyncHandler(orderController.findAll));

/**
 * @swagger
 * /api/orders/search:
 *   get:
 *     summary: Search orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header    
*         name: Authorization
*         required: true        
*         description: Bearer token
*         schema:
*           type: string
*           example: Bearer <your_access_token>
 *       - in: query
 *         name: text
 *         required: true 
 *         schema:
 *           type: string
 *         description: Search by food, food variant, or shop name
 *     responses:
 *       200:
 *         description: List of matching orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/search", asyncHandler(orderController.search));

module.exports = router;
