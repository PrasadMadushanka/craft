const express = require("express");
const router = express.Router();
const ProductsController = require("../../controllers/product/product.controller.js");
const asyncHandler = require("../../middlewares/asyncHandler.middleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         stock:
 *           type: integer
 *         active:
 *           type: integer
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         shop_id:
 *           type: integer
 *         category_id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         product_variant:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductVariant'
 *
 * /api/product/all:
 *   get:
 *     summary: Get all Products for a shop
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shopId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the shop
 *     responses:
 *       200:
 *         description: List of products
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/all", asyncHandler(ProductsController.findAll));

/**
 * @swagger
 * /api/Product/search:
 *   get:
 *     summary: Search Products by name
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name to search for
 *     responses:
 *       200:
 *         description: List of matching products
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/search", asyncHandler(ProductsController.productSearch));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get Product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product item ID
 *     responses:
 *       200:
 *         description: Item found
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
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product item not found
 */
router.get("/:id", asyncHandler(ProductsController.findOne));

module.exports = router;