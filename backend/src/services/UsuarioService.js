import { hash } from "bcryptjs";
import { hashPassword } from "../utils/bcrypt.js";

export class UsuarioService {
    constructor(usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    async criarUsuario({ nome, email, senha, tipoAcesso }) {
        if (!nome || !email || !senha || !tipoAcesso) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        const existe = await this.usuarioRepo.buscarUsuarioPorEmail(email);
        if (existe) {
            throw new Error("E-mail já cadastrado.");
        }
        const senhaHash = await hashPassword(senha);

        const usuario = await this.usuarioRepo.criarUsuario({ nome, email, senha: senhaHash, tipoAcesso });
        return usuario;
    }

    async buscarTodosUsuarios() {
        return await this.usuarioRepo.buscarUsuarios();
    }

    async buscarUsuarioPorId(id) {
        const usuario = await this.usuarioRepo.buscarUsuarioPorId(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        return usuario;
    }

    async atualizarUsuario(id, dadosAtualizados) {
        const usuario = await this.usuarioRepo.buscarUsuarioPorId(id);
        if (!usuario) throw new Error("Usuário não encontrado.");

        if (dadosAtualizados.email && dadosAtualizados.email !== usuario.email) {
            const emailExistente = await this.usuarioRepo.buscarUsuarioPorEmail(dadosAtualizados.email);
            if (emailExistente) throw new Error("E-mail já cadastrado.");
        }

        return await this.usuarioRepo.atualizarUsuario(id, dadosAtualizados);
    }

    async deletarUsuario(id) {
        const usuario = await this.usuarioRepo.buscarUsuarioPorId(id);
        if (!usuario) throw new Error("Usuário não encontrado.");
        return await this.usuarioRepo.deletarUsuario(id);
    }
}
