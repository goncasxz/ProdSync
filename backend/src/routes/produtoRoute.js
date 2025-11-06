import express from 'express';
import { makeProdutoController } from '../controller/produtoController.js';
import { authMiddleware } from "../middleware/authMiddleware.js";

export function createProdutoRoutes({ produtoService }) {
    const router = express.Router();
    const controller = makeProdutoController({ produtoService });

    router.post('/', authMiddleware,controller.criarProduto);
    router.get('/', authMiddleware,controller.buscarProdutos);
    router.get('/:id', authMiddleware,controller.buscarProdutoPorId);
    router.put('/:id', authMiddleware,controller.atualizarProduto);
    router.delete('/:id', authMiddleware,controller.deletarProduto);

    return router;
}
