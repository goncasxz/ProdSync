export function makeMateriaPrimaController({ materiaPrimaService }) {
    return {

        /**
         * @swagger
         * /materias-primas:
         *   post:
         *     summary: Cria uma nova matéria-prima
         *     tags: [Materias-Primas]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - nome
         *               - quantidade
         *               - unidadeMedida
         *               - lote
         *             properties:
         *               nome:
         *                 type: string
         *                 example: Açúcar Refinado
         *               quantidade:
         *                 type: number
         *                 example: 100
         *               unidadeMedida:
         *                 type: string
         *                 example: kg
         *               lote:
         *                 type: string
         *                 example: LOTE-2025-A1
         *     responses:
         *       201:
         *         description: Matéria-prima criada com sucesso
         *       400:
         *         description: Dados inválidos ou erro ao criar
         */
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

        /**
         * @swagger
         * /materias-primas:
         *   get:
         *     summary: Lista todas as matérias-primas cadastradas
         *     tags: [Materias-Primas]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Lista retornada com sucesso
         *       400:
         *         description: Erro ao buscar matérias-primas
         */
        buscarTodasMateriasPrimas: async (req, res) => {
            try {
                const materiasPrimas = await materiaPrimaService.buscarTodasMateriasPrimas();
                res.json({ ok: true, materiasPrimas });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /materias-primas/{id}:
         *   get:
         *     summary: Busca uma matéria-prima pelo ID
         *     tags: [Materias-Primas]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Matéria-prima encontrada
         *       404:
         *         description: Matéria-prima não encontrada
         */
        buscarMateriaPrimaPorId: async (req, res) => {
            try {
                const { id } = req.params;
                const materiaPrima = await materiaPrimaService.buscarMateriaPrimaPorId(Number(id));
                res.json({ ok: true, materiaPrima });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /materias-primas/{id}:
         *   put:
         *     summary: Atualiza uma matéria-prima
         *     tags: [Materias-Primas]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         schema:
         *           type: integer
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               nome:
         *                 type: string
         *               quantidade:
         *                 type: number
         *               unidadeMedida:
         *                 type: string
         *               lote:
         *                 type: string
         *           example:
         *             nome: Açúcar Refinado
         *             quantidade: 150
         *             unidadeMedida: kg
         *             lote: LOTE-2025-A1
         *     responses:
         *       200:
         *         description: Matéria-prima atualizada com sucesso
         *       404:
         *         description: Matéria-prima não encontrada
         */
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

        /**
         * @swagger
         * /materias-primas/{id}:
         *   delete:
         *     summary: Deleta uma matéria-prima pelo ID
         *     tags: [Materias-Primas]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Matéria-prima deletada com sucesso
         *       404:
         *         description: Matéria-prima não encontrada
         */
        deletarMateriaPrima: async (req, res) => {
            try {
                const { id } = req.params;
                await materiaPrimaService.deletarMateriaPrima(Number(id));
                res.json({ ok: true, message: "Matéria-prima deletada com sucesso." });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /materias-primas/lote/{lote}:
         *   get:
         *     summary: Busca uma matéria-prima pelo número do lote
         *     tags: [Materias-Primas]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - name: lote
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Matéria-prima encontrada pelo lote
         *       404:
         *         description: Nenhuma matéria-prima encontrada para o lote informado
         */
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
