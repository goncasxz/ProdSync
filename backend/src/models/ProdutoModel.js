export default class Produto {
    constructor({ id = null, nome, lote, quantidade, dataProducao = new Date(), usuarioId }) {
        this.id = id;
        this.nome = nome;
        this.lote = lote;
        this.quantidade = quantidade;
        this.dataProducao = dataProducao;
        this.usuarioId = usuarioId;
    }
}