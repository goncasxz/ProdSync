import express from "express";
import { makeUsuarioController } from "../controller/usuarioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authTypo } from "../middleware/authTypo.js";

export function createUsuarioRoutes({ usuarioService }) {
    const router = express.Router();
    const controller = makeUsuarioController({ usuarioService });

    router.post("/", authMiddleware,authTypo, controller.criarUsuario);
    router.get("/", authMiddleware, authTypo, controller.buscarTodosUsuarios);
    router.get("/:id", authMiddleware, authTypo, controller.buscarUsuarioPorId);
    router.put("/:id", authMiddleware, authTypo, controller.atualizarUsuario);
    router.delete("/:id", authMiddleware, authTypo, controller.deletarUsuario);

    return router;
}
