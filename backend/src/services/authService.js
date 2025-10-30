import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export class AuthService {
    constructor(usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    async register({ nome, email, senha, tipoAcesso }) {
        const existe = await this.usuarioRepo.buscarUsuarioPorEmail(email);
        if (existe) throw new Error("E-mail já cadastrado.");

        const senhaHash = await hashPassword(senha);
        const novo = await this.usuarioRepo.criarUsuario({
            nome,
            email,
            senha: senhaHash,
            tipoAcesso
        });

        const token = generateToken({ id: novo.id, email: novo.email, tipoAcesso: novo.tipoAcesso });
        return { usuario: { id: novo.id, nome: novo.nome, email: novo.email }, token };
    }

    async login({ email, senha }) {
        const user = await this.usuarioRepo.buscarUsuarioPorEmail(email);
        if (!user) throw new Error("Usuário/senha inválidos.");

        const ok = await comparePassword(senha, user.senha);
        if (!ok) throw new Error("Usuário/senha inválidos.");

        const token = generateToken({ id: user.id, email: user.email, tipoAcesso: user.tipoAcesso });
        return { usuario: { id: user.id, nome: user.nome, email: user.email }, token };
    }
}