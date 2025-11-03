import express from "express";
import { makeMateriaPrimaController } from "../controller/materiaPrimaController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export function createMateriaPrimaRoutes({ materiaPrimaService }) {
    const router = express.Router();
    const controller = makeMateriaPrimaController({ materiaPrimaService });

    router.post("/", authMiddleware, controller.criarMateriaPrima);
    router.get("/", authMiddleware, controller.buscarTodasMateriasPrimas);
    router.get("/:id", authMiddleware, controller.buscarMateriaPrimaPorId);
    router.put("/:id", authMiddleware, controller.atualizarMateriaPrima);
    router.delete("/:id", authMiddleware, controller.deletarMateriaPrima);

    return router;
}
