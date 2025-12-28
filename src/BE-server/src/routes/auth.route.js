const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

/**
 * Auth Routes
 * All authentication endpoints
 */

// Public routes (no authentication required)
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verification", AuthController.resendVerificationEmail);
router.post("/refresh-token", AuthController.refreshToken);

// Protected routes (authentication required)
router.post(
  "/logout",
  AuthMiddleware.authenticate,
  AuthController.logout
);

module.exports = router;

