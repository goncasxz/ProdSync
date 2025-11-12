export function makeProducaoController({ producaoService }) {
  return {
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

    listarProducoes: async (req, res) => {
      try {
        const lista = await producaoService.listarProducoes();
        return res.json({ ok: true, producoes: lista });
      } catch (err) {
        return res.status(400).json({ ok: false, error: err.message });
      }
    },

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
    }
  };
}
