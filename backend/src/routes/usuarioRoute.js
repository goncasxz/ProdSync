import express from "express";
import { makeUsuarioController } from "../controller/usuarioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export function createUsuarioRoutes({ usuarioService }) {
    const router = express.Router();
    const controller = makeUsuarioController({ usuarioService });

    router.post("/", authMiddleware, controller.criarUsuario);
    router.get("/", authMiddleware, controller.buscarTodosUsuarios);
    router.get("/:id", authMiddleware, controller.buscarUsuarioPorId);
    router.put("/:id", authMiddleware, controller.atualizarUsuario);
    router.delete("/:id", authMiddleware, controller.deletarUsuario);

    return router;
}
