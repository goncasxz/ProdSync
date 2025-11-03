export function authTypo(req, res, next) {
    if(req.user.tipoAcesso.trim().toLowerCase() !== "admin") {
        return res.status(403).json({ ok: false, error: "Acesso negado. Apenas administradores." });
    }

    next();
}