export function makeUsuarioController({ usuarioService }) {
    return {
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

        buscarTodosUsuarios: async (req, res) => {
            try {
                const usuarios = await usuarioService.buscarTodosUsuarios();
                res.json({ ok: true, usuarios });
            } catch (err) {
                res.status(400).json({ ok: false, error: err.message });
            }
        },

        buscarUsuarioPorId: async (req, res) => {
            try {
                const { id } = req.params;
                const usuario = await usuarioService.buscarUsuarioPorId(Number(id));
                res.json({ ok: true, usuario });
            } catch (err) {
                res.status(404).json({ ok: false, error: err.message });
            }
        },

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
