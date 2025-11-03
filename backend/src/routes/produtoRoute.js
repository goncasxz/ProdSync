import express from 'express';
import { makeProdutoController } from '../controller/produtoController.js';

export function createProdutoRoutes({ produtoService }) {
    const router = express.Router();
    const controller = makeProdutoController({ produtoService });

    router.post('/', controller.criarProduto);
    router.get('/', controller.buscarProdutos);
    router.get('/:id', controller.buscarProdutoPorId);
    router.put('/:id', controller.atualizarProduto);
    router.delete('/:id', controller.deletarProduto);

    return router;
}
