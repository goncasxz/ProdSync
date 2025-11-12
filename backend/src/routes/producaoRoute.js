import express from 'express';
import { makeProducaoController } from '../controller/producaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export function createProducaoRoutes({ producaoService }) {
  const router = express.Router();
  const controller = makeProducaoController({ producaoService });

  router.post('/', authMiddleware, controller.produzir);
  router.get('/', authMiddleware, controller.listarProducoes);
  router.get('/produto/:produtoId', authMiddleware, controller.listarPorProduto);

  return router;
}
