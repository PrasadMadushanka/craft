const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/auth.controller");
const asyncHandler = require("../../middlewares/asyncHandler.middleware");

/**
 * @swagger
 * tags:
 *   name:  Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - mobile
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               mobile:
 *                 type: string
 *                 description: User's mobile number
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: string
 *                   example: User registered successfully.
 *       406:
 *         description: Invalid input data
 */ 
router.post("/sign-up", asyncHandler(authController.signUp));

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: Login with mobile and OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - otp
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: User's mobile number
 *                 example: "0771502456"
 *               otp:
 *                 type: string
 *                 description: One Time Password sent to the user
 *                 example: "316624"
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   type: object
 *                   properties:
 *                     Token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5NDc3MTUwMjQ1NiIsImlhdCI6MTc1MTE5MzMzNCwiZXhwIjoxNzUxMjc5NzM0fQ.r1_MZQfbarURpCxx7A_VaC-hEkjJOPMwyWi1Iz9JQYs
 *       401:
 *         description: Invalid credentials
 */
router.post("/sign-in", asyncHandler(authController.signIn));

/**
 * @swagger
 * /api/auth/request-otp:
 *   post:
 *     summary: Request OTP for authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: User's mobile number
 *                 example: "+94771502456"
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                   type: string
 *                   example: OTP sent successfully.
 *       400:
 *         description: Invalid mobile number
 *       401:
 *        description: Unauthorized - Mobile number is missing or invalid
 */
router.post("/request-otp", asyncHandler(authController.requestOTP));

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Use the token to get a refreshed token
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
 *         description: Token refreshed successfully
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
 *                   type: object
 *                   properties:
 *                     refreshedToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI5NDc3MTUwMjQ1NiIsImlhdCI6MTc1MTE5MzMzNCwiZXhwIjoxNzUxMjc5NzM0fQ.r1_MZQfbarURpCxx7A_VaC-hEkjJOPMwyWi1Iz9JQYs
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 */
router.post("/refresh-token", asyncHandler(authController.refreshToken));



module.exports = router;