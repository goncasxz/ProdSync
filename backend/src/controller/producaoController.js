export function makeProducaoController({ producaoService }) {
  return {

    /**
     * @swagger
     * /producao:
     *   post:
     *     summary: Registra uma nova produção
     *     tags: [Produção]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - produtoId
     *               - quantidadeProduzida
     *               - materiasPrimas
     *             properties:
     *               produtoId:
     *                 type: integer
     *                 example: 1
     *               quantidadeProduzida:
     *                 type: number
     *                 example: 50
     *               materiasPrimas:
     *                 type: array
     *                 items:
     *                   type: object
     *                   required:
     *                     - id
     *                     - quantidadeUsada
     *                   properties:
     *                     id:
     *                       type: integer
     *                       example: 3
     *                     quantidadeUsada:
     *                       type: number
     *                       example: 10
     *     responses:
     *       201:
     *         description: Produção registrada com sucesso
     *       400:
     *         description: Erros de validação no corpo da requisição
     *       401:
     *         description: Usuário não autenticado
     */
    produzir: async (req, res) => {
      try {
        const body = req.body || {};
        const { produtoId, quantidadeProduzida, materiasPrimas } = body;
        const usuarioId = req.user && req.user.id;

        if (!usuarioId)
          return res.status(401).json({ ok: false, error: 'Usuário não autenticado.' });

        if (!produtoId || quantidadeProduzida == null)
          return res.status(400).json({ ok: false, error: 'produtoId e quantidadeProduzida são obrigatórios.' });

        if (!Array.isArray(materiasPrimas) || materiasPrimas.length === 0)
          return res.status(400).json({ ok: false, error: 'materiasPrimas deve ser um array não vazio.' });

        const mps = materiasPrimas.map((p, idx) => {
          if (p == null || (p.id == null) || (p.quantidadeUsada == null)) {
            throw new Error(`Item inválido na posição ${idx}: precisa conter id e quantidadeUsada.`);
          }
          return { id: Number(p.id), quantidadeUsada: Number(p.quantidadeUsada) };
        });

        const out = await producaoService.produzir({
          produtoId: Number(produtoId),
          quantidadeProduzida: Number(quantidadeProduzida),
          materiasPrimas: mps,
          usuarioId
        });

        return res.status(201).json({
          ok: true,
          message: 'Produção registrada com sucesso.',
          lote: out.lote,
          data: out
        });
      } catch (err) {
        const status = err.statusCode || 400;
        return res.status(status).json({ ok: false, error: err.message });
      }
    },

    /**
     * @swagger
     * /producao:
     *   get:
     *     summary: Lista todas as produções registradas
     *     tags: [Produção]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de produções retornada com sucesso
     *       400:
     *         description: Erro ao buscar produções
     */
    listarProducoes: async (req, res) => {
      try {
        const lista = await producaoService.listarProducoes();
        return res.json({ ok: true, producoes: lista });
      } catch (err) {
        return res.status(400).json({ ok: false, error: err.message });
      }
    },

    /**
     * @swagger
     * /producao/produto/{produtoId}:
     *   get:
     *     summary: Lista produções filtradas por produto
     *     tags: [Produção]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: produtoId
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *         example: 1
     *     responses:
     *       200:
     *         description: Lista de produções encontrada
     *       400:
     *         description: produtoId inválido
     */
    listarPorProduto: async (req, res) => {
      try {
        const produtoId = Number(req.params.produtoId);
        if (!produtoId)
          return res.status(400).json({ ok: false, error: 'produtoId inválido.' });

        const lista = await producaoService.listarProducoesPorProduto(produtoId);
        return res.json({ ok: true, producoes: lista });
      } catch (err) {
        return res.status(400).json({ ok: false, error: err.message });
      }
    },

    /**
     * @swagger
     * /producao/lote/{lote}:
     *   get:
     *     summary: Busca produções pelo número do lote
     *     tags: [Produção]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: lote
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *         example: LOTE-2025-A1
     *     responses:
     *       200:
     *         description: Produções encontradas pelo lote
     *       400:
     *         description: Lote não informado ou erro na consulta
     */
    listarPorLote: async (req, res) => {
      try {
        const lote = req.params.lote;
        if (!lote) return res.status(400).json({ ok: false, error: 'Lote não informado.' });

        const producoes = await producaoService.listarPorLote(lote);
        return res.json({ ok: true, producoes });
      } catch (err) {
        return res.status(400).json({ ok: false, error: err.message });
      }
    }

  };
}
