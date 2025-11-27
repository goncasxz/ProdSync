export function makeProdutoController({ produtoService }) {
    return {

        /**
         * @swagger
         * /produtos:
         *   post:
         *     summary: Cria um novo produto
         *     tags: [Produtos]
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
         *             properties:
         *               nome:
         *                 type: string
         *                 example: "Camiseta Azul"
         *               quantidade:
         *                 type: number
         *                 example: 100
         *     responses:
         *       201:
         *         description: Produto criado com sucesso
         *       400:
         *         description: Campos obrigatórios ausentes
         */
        criarProduto: async (req, res) => {
            try {
                const { nome, quantidade } = req.body;
                const usuarioId = req.user.id;

                if (!nome || quantidade == null) {
                    return res.status(400).json({ ok: false, error: "Todos os campos são obrigatórios." });
                }

                const produto = await produtoService.criarProduto({ nome, quantidade, usuarioId });
                res.status(201).json({ ok: true, produto });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /produtos:
         *   get:
         *     summary: Lista todos os produtos
         *     tags: [Produtos]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Lista de produtos retornada com sucesso
         *       400:
         *         description: Erro ao buscar produtos
         */
        buscarProdutos: async (req, res) => {
            try {
                const produtos = await produtoService.buscarProdutos();
                res.json({ ok: true, produtos });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /produtos/{id}:
         *   get:
         *     summary: Busca um produto pelo ID
         *     tags: [Produtos]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Produto encontrado
         *       404:
         *         description: Produto não encontrado
         */
        buscarProdutoPorId: async (req, res) => {
            try {
                const produto = await produtoService.buscarProdutoPorId(Number(req.params.id));
                res.json({ ok: true, produto });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /produtos/{id}:
         *   put:
         *     summary: Atualiza um produto existente
         *     tags: [Produtos]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         example: 1
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             example:
         *               nome: "Produto Atualizado"
         *               quantidade: 200
         *     responses:
         *       200:
         *         description: Produto atualizado com sucesso
         *       400:
         *         description: Erro ao atualizar produto
         */
        atualizarProduto: async (req, res) => {
            try {
                const produto = await produtoService.atualizarProduto(Number(req.params.id), req.body);
                res.json({ ok: true, produto });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /produtos/{id}:
         *   delete:
         *     summary: Deleta um produto
         *     tags: [Produtos]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Produto deletado com sucesso
         *       400:
         *         description: Erro ao deletar produto
         */
        deletarProduto: async (req, res) => {
            try {
                await produtoService.deletarProduto(Number(req.params.id));
                res.json({ ok: true, message: "Produto deletado com sucesso." });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        }
    };
}
