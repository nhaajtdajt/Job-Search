const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const AuthValidator = require("../validators/auth.validator");
const ValidateMiddleware = require("../middlewares/validate.middleware");

/**
 * Auth Routes
 * All authentication endpoints with validation
 */

// Public routes (no authentication required)
router.post("/register", 
  AuthValidator.register,
  ValidateMiddleware.handle,
  AuthController.register
);

router.post("/login", 
  AuthValidator.login,
  ValidateMiddleware.handle,
  AuthController.login
);

router.post("/forgot-password", 
  AuthValidator.forgotPassword,
  ValidateMiddleware.handle,
  AuthController.forgotPassword
);

router.post("/reset-password", 
  AuthValidator.resetPassword,
  ValidateMiddleware.handle,
  AuthController.resetPassword
);

router.post("/verify-email", 
  AuthValidator.verifyEmail,
  ValidateMiddleware.handle,
  AuthController.verifyEmail
);

router.post("/resend-verification", 
  AuthValidator.resendVerification,
  ValidateMiddleware.handle,
  AuthController.resendVerificationEmail
);

router.post("/refresh-token", 
  AuthValidator.refreshToken,
  ValidateMiddleware.handle,
  AuthController.refreshToken
);

// Protected routes (authentication required)
router.post(
  "/logout",
  AuthMiddleware.authenticate,
  AuthController.logout
);

module.exports = router;
