export default class MateriaPrima {
    constructor({ id = null, nome, lote, quantidade, dataEntrada = new Date(), usuarioId }) {
        this.id = id;
        this.nome = nome;
        this.lote = lote;
        this.quantidade = quantidade;
        this.dataEntrada = dataEntrada;
        this.usuarioId = usuarioId;
    }
}