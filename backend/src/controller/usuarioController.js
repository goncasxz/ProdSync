/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints de gerenciamento de usuários do sistema.
 */

export function makeUsuarioController({ usuarioService }) {
    return {

        /**
         * @swagger
         * /usuarios:
         *   post:
         *     security:
         *       - bearerAuth: [] 
         *     x-admin-required: true
         *     summary: Cria um novo usuário
         *     tags: [Usuários]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - nome
         *               - email
         *               - senha
         *               - tipoAcesso
         *             properties:
         *               nome:
         *                 type: string
         *                 example: João Silva
         *               email:
         *                 type: string
         *                 example: joao@email.com
         *               senha:
         *                 type: string
         *                 example: minhaSenha123
         *               tipoAcesso:
         *                 type: string
         *                 example: admin
         *     responses:
         *       201:
         *         description: Usuário criado com sucesso.
         *       400:
         *         description: Dados inválidos ou ausentes.
         */
        criarUsuario: async (req, res) => {
            try {
                const { nome, email, senha, tipoAcesso } = req.body || {};
                if (!nome || !email || !senha || !tipoAcesso) {
                    return res.status(400).json({ ok: false, error: "Todos os campos são obrigatórios." });
                }

                const usuario = await usuarioService.criarUsuario({ nome, email, senha, tipoAcesso });
                res.status(201).json({ ok: true, usuario });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /usuarios:
         *   get:
         *     summary: Lista todos os usuários cadastrados
         *     tags: [Usuários]
         *     responses:
         *       200:
         *         description: Lista de usuários retornada com sucesso.
         */
        buscarTodosUsuarios: async (req, res) => {
            try {
                const usuarios = await usuarioService.buscarTodosUsuarios();
                res.json({ ok: true, usuarios });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /usuarios/{id}:
         *   get:
         *     summary: Busca usuário por ID
         *     tags: [Usuários]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Usuário encontrado.
         *       404:
         *         description: Usuário não encontrado.
         */
        buscarUsuarioPorId: async (req, res) => {
            try {
                const { id } = req.params;
                const usuario = await usuarioService.buscarUsuarioPorId(Number(id));
                res.json({ ok: true, usuario });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /usuarios/{id}:
         *   put:
         *     summary: Atualiza um usuário
         *     tags: [Usuários]
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
         *             properties:
         *               nome:
         *                 type: string
         *                 example: Novo Nome
         *               email:
         *                 type: string
         *                 example: novo@email.com
         *               senha:
         *                 type: string
         *                 example: novaSenha123
         *               tipoAcesso:
         *                 type: string
         *                 example: comum
         *     responses:
         *       200:
         *         description: Usuário atualizado com sucesso.
         *       404:
         *         description: Usuário não encontrado.
         */
        atualizarUsuario: async (req, res) => {
            try {
                const { id } = req.params;
                const dadosAtualizados = req.body;
                const usuario = await usuarioService.atualizarUsuario(Number(id), dadosAtualizados);
                res.json({ ok: true, usuario });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /usuarios/{id}:
         *   delete:
         *     summary: Deleta um usuário
         *     tags: [Usuários]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         example: 1
         *     responses:
         *       200:
         *         description: Usuário deletado com sucesso.
         *       404:
         *         description: Usuário não encontrado.
         */
        deletarUsuario: async (req, res) => {
            try {
                const { id } = req.params;
                await usuarioService.deletarUsuario(Number(id));
                res.json({ ok: true, message: "Usuário deletado com sucesso." });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        }

    };
}
