export function makeMateriaPrimaController({ materiaPrimaService }) {
    return {
        criarMateriaPrima: async (req, res) => {
            try {
                const { nome, quantidade, unidadeMedida, lote} = req.body || {};
                const usuarioId = req.user.id;
                if (!nome || quantidade == null || !unidadeMedida || !lote) {
                    return res.status(400).json({ ok: false, error: "Todos os campos são obrigatórios." });
                }

                const materiaPrima = await materiaPrimaService.criarMateriaPrima({ nome, quantidade, unidadeMedida, lote, usuarioId });
                res.status(201).json({ ok: true, materiaPrima });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        buscarTodasMateriasPrimas: async (req, res) => {
            try {
                const materiasPrimas = await materiaPrimaService.buscarTodasMateriasPrimas();
                res.json({ ok: true, materiasPrimas });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        buscarMateriaPrimaPorId: async (req, res) => {
            try {
                const { id } = req.params;
                const materiaPrima = await materiaPrimaService.buscarMateriaPrimaPorId(Number(id));
                res.json({ ok: true, materiaPrima });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        atualizarMateriaPrima: async (req, res) => {
            try {
                const { id } = req.params;
                const dadosAtualizados = req.body;
                const materiaPrima = await materiaPrimaService.atualizarMateriaPrima(Number(id), dadosAtualizados);
                res.json({ ok: true, materiaPrima });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        deletarMateriaPrima: async (req, res) => {
            try {
                const { id } = req.params;
                await materiaPrimaService.deletarMateriaPrima(Number(id));
                res.json({ ok: true, message: "Matéria-prima deletada com sucesso." });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        buscarMateriaPrimaPorLote: async (req, res) => {
            try {
                const { lote } = req.params;
                const materiaPrima = await materiaPrimaService.buscarMateriaPrimaPorLote(lote);
                res.json({ ok: true, materiaPrima });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        }
    };
}
