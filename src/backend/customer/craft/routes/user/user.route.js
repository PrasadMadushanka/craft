const express = require("express");
const router = express.Router();
const authController = require("../../controllers/user/user.controller.js");
const asyncHandler = require("../../middlewares/asyncHandler.middleware.js");

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve the authenticated user's profile using the JWT token.
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
 *         description: Profile fetched successfully
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
 *                   example: Profile fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@email.com
 *                     mobile:
 *                       type: string
 *                       example: 94771234567
 *                     is_active:
 *                       type: boolean
 *                       example: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-08T15:28:35.000Z
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-30T03:08:34.000Z
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: 401
 *                 message:
 *                   type: integer
 *                   example: Unauthorized
 *                 error:
 *                   type: string
 *                   example: Invalid token.
 */
router.get("/profile", asyncHandler(authController.profile));

/**
 * @swagger
 * /api/user/edit-profile:
 *   put:
 *     summary: Edit user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Update one or more fields of the authenticated user's profile.
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               image:
 *                 type: string
 *                 example: https://your-bucket.com/avatar.png
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@email.com
 *                     image:
 *                       type: string
 *                       example: https://your-bucket.com/avatar.png
 *                     mobile:
 *                       type: string
 *                       example: 94771234567
 *       406:
 *         description: No fields to update or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 406
 *                 message:
 *                   type: boolean
 *                   example: Not Acceptable
 *                 error:
 *                   type: string
 *                   example: No fields to update.
 *       401:
 *         description: Unauthorized or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: boolean
 *                   example: Unauthorized
 *                 error:
 *                   type: string
 *                   example: Token is missing or invalid.
 */
router.put("/edit-profile", asyncHandler(authController.editProfile));

/**
 * @swagger
 * /api/user/fcm-token:
 *   put:
 *     summary: Store or update FCM token for the authenticated user
 *     tags: [User]
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
 *             properties:
 *               fcm_token:
 *                 type: string
 *                 example: "fcm_token_here"
 *     responses:
 *       200:
 *         description: FCM token updated successfully
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
 *                   example: FCM token updated successfully.
 */
router.put("/fcm-token", asyncHandler(authController.updateFcmToken));

module.exports = router;