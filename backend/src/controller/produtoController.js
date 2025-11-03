export function makeProdutoController({ produtoService }) {
    return {
        criarProduto: async (req, res) => {
            try {
                const { nome, quantidade, dataProducao} = req.body;
                const usuarioId = req.user.id;
                if (!nome || quantidade == null || !dataProducao) {
                    return res.status(400).json({ ok: false, error: "Todos os campos são obrigatórios." });
                }
                const produto = await produtoService.criarProduto({ nome, quantidade, dataProducao, usuarioId });
                res.status(201).json({ ok: true, produto });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        buscarProdutos: async (req, res) => {
            try {
                const produtos = await produtoService.buscarProdutos();
                res.json({ ok: true, produtos });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        buscarProdutoPorId: async (req, res) => {
            try {
                const produto = await produtoService.buscarProdutoPorId(Number(req.params.id));
                res.json({ ok: true, produto });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        atualizarProduto: async (req, res) => {
            try {
                const produto = await produtoService.atualizarProduto(Number(req.params.id), req.body);
                res.json({ ok: true, produto });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        deletarProduto: async (req, res) => {
            try {
                await produtoService.deletarProduto(Number(req.params.id));
                res.json({ ok: true, message: "Produto deletado com sucesso." });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        buscarProdutoPorLote: async (req, res) => {
            try {
                const produto = await produtoService.buscarProdutoPorLote(req.params.lote);
                res.json({ ok: true, produto });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        }
    };
}
