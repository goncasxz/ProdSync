import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwtConfig.js";

export function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return { error: "Token expirado" };
        } else if (err.name === "JsonWebTokenError") {
            return { error: "Token inválido" };
        } else {
            return { error: "Erro ao verificar token" };
        }
    }
}