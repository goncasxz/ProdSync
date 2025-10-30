import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
    const auth = req.headers.authorization || "";
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ ok: false, error: "Token ausente ou mal formatado" });
    }

    const result = verifyToken(parts[1]);
    if (result.error) {
        return res.status(401).json({ ok: false, error: result.error });
    }

    req.user = result;
    return next();
}