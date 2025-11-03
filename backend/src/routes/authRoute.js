import express from "express";
import { makeAuthController } from "../controller/authController.js";

export function createAuthRoutes({ authService }) {
  const router = express.Router();
  const controller = makeAuthController({ authService });

  router.post("/register", controller.register);
  router.post("/login", controller.login);

  return router;
}