import prisma from '../services/prismaClient.js';

export default class Usuario {
    constructor({ id = null, nome, email, senha, tipoAcesso }) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipoAcesso = tipoAcesso;
    }
}