import express from "express";
import { makeAuthController } from "../controllers/authController.js";

export function createAuthRoutes({ authService }) {
  const router = express.Router();
  const controller = makeAuthController({ authService });

  router.post("/auth/register", controller.register);
  router.post("/auth/login", controller.login);

  return router;
}