/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação e registro de usuários
 */

export function makeAuthController({ authService }) {
    return {

        /**
         * @swagger
         * /auth/register:
         *   post:
         *     security: []
         *     summary: Registra um novo usuário
         *     tags: [Auth]
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
         *             properties:
         *               nome:
         *                 type: string
         *                 example: João Silva
         *               email:
         *                 type: string
         *                 example: joao@email.com
         *               senha:
         *                 type: string
         *                 example: "123456"
         *     responses:
         *       201:
         *         description: Usuário registrado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 ok:
         *                   type: boolean
         *                   example: true
         *                 usuario:
         *                   type: object
         *                   example: { id: 1, nome: "João Silva", email: "joao@email.com" }
         *       400:
         *         description: Dados inválidos ou ausentes
         */
        register: async (req, res) => {
            try {
                const { nome, email, senha } = req.body || {};
                if (!nome || !email || !senha)
                    return res.status(400).json({ ok: false, error: "Campos obrigatórios ausentes." });

                const out = await authService.register({ nome, email, senha });
                res.status(201).json({ ok: true, ...out });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        /**
         * @swagger
         * /auth/login:
         *   post:
         *     security: []
         *     summary: Autentica um usuário e retorna o token JWT
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - email
         *               - senha
         *             properties:
         *               email:
         *                 type: string
         *                 example: joao@email.com
         *               senha:
         *                 type: string
         *                 example: "123456"
         *     responses:
         *       200:
         *         description: Login realizado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 ok:
         *                   type: boolean
         *                   example: true
         *                 token:
         *                   type: string
         *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
         *                 usuario:
         *                   type: object
         *                   example: { id: 1, nome: "João Silva" }
         *       401:
         *         description: Credenciais inválidas
         */
        login: async (req, res) => {
            try {
                const { email, senha } = req.body || {};
                if (!email || !senha)
                    return res.status(400).json({ ok: false, error: "E-mail e senha são obrigatórios." });

                const out = await authService.login({ email, senha });
                res.json({ ok: true, ...out });
            } catch (err) {
                res.status(401).json({ ok: false, error: err.message });
            }
        },
    };
}
