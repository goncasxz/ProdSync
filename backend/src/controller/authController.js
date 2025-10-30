export function makeAuthController({ authService }) {
    return {
        register: async (req, res) => {
        try {
            const { nome, email, senha, tipoAcesso } = req.body || {};
            if (!nome || !email || !senha || !tipoAcesso)
                return res.status(400).json({ ok: false, error: "Campos obrigatórios ausentes." });
            const out = await authService.register({ nome, email, senha, tipoAcesso });
            res.status(201).json({ ok: true, ...out });
        } catch (err) {
            res.status(400).json({ ok: false, error: err.message });
        }
        },

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