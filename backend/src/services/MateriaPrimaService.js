export class MateriaPrimaService {
    constructor(materiaPrimaRepo) {
        this.materiaPrimaRepo = materiaPrimaRepo;
    }

    async criarMateriaPrima({ nome, quantidade, unidadeMedida, lote, usuarioId}) {
        const materiaPrima = await this.materiaPrimaRepo.criarMateriaPrima({ nome, quantidade, unidadeMedida, lote, usuarioId});
        return materiaPrima;
    }

    async buscarTodasMateriasPrimas() {
        return await this.materiaPrimaRepo.buscarMateriasPrimas();
    }

    async buscarMateriaPrimaPorId(id) {
        const materiaPrima = await this.materiaPrimaRepo.buscarMateriaPrimaPorId(id);
        if (!materiaPrima) {
            throw new Error("Matéria-prima não encontrada.");
        }
        return materiaPrima;
    }

    async atualizarMateriaPrima(id, dadosAtualizados) {
        const materiaPrima = await this.materiaPrimaRepo.buscarMateriaPrimaPorId(id);
        if (!materiaPrima) throw new Error("Matéria-prima não encontrada.");
        return await this.materiaPrimaRepo.atualizarMateriaPrima(id, dadosAtualizados);
    }

    async deletarMateriaPrima(id) {
        const materiaPrima = await this.materiaPrimaRepo.buscarMateriaPrimaPorId(id);
        if (!materiaPrima) throw new Error("Matéria-prima não encontrada.");
        return await this.materiaPrimaRepo.deletarMateriaPrima(id);
    }

    async buscarMateriaPrimaPorLote(lote) {
        const materiaPrima = await this.materiaPrimaRepo.buscarMateriaPrimaPorLote(lote);
        if (!materiaPrima) {
            throw new Error("Matéria-prima não encontrada para o lote especificado.");
        }
        return materiaPrima;
    }
}