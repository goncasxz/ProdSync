import React from "react";
import "./dashboard.css";

const MENU_ITEMS = [
  { key: "produtos",       title: "Produtos",          sub: "Cadastros • Produtos" },
  { key: "cupons",         title: "Cupons/Voucher",    sub: "Cadastros • Cupons/Voucher" },
  { key: "fornecedores",   title: "Fornecedores",      sub: "Cadastros • Fornecedores" },
  { key: "clientes",       title: "Clientes",          sub: "Cadastros • Clientes" },
  { key: "grupo-usuarios", title: "Grupo de usuários", sub: "Usuários • Grupo de usuários" },
  { key: "usuarios",       title: "Usuários",          sub: "Cadastros • Usuários" },
  { key: "plano-contas",   title: "Plano de contas",   sub: "Financeiro • Plano de contas" },
  { key: "cfops",          title: "CFOP's",            sub: "Fiscal • CFOP's" },
];

const SECTION_ITEMS = {
  operacional: [
    { key: "entrada-produto",   title: "Entrada de produto",    sub: "Operacional" },
    { key: "cadastro-produtos", title: "Cadastro de produtos",  sub: "Operacional" },
  ],
  financeiro: [
    { key: "estoque-produtos",  title: "Estoque de produtos",   sub: "Estoque" },
  ],
  fiscal: [
    { key: "exec-producao",     title: "Produção",              sub: "Produção" },
  ],
  relatorios: [
  { key: "rastrear-produtos", title: "Rastrear produtos", sub: "Rastreabilidade" },
],
mensagens: [],
config: [
  { key: "configuracoes", title: "Tema (Claro / Escuro)", sub: "Configurações" },
  { key: "usuarios-sistema", title: "Usuários do sistema", sub: "Configurações" }
],

};

const ALL_FAVORITABLE = [
  ...MENU_ITEMS,
  ...Object.values(SECTION_ITEMS).flat(),
];

/* Rail */
const RAIL = [
  { key:"operacional", icon:"📦", label:"Operacional",    opensModal:false },
  { key:"financeiro",  icon:"💰", label:"Estoque",        opensModal:false  },
  { key:"fiscal",      icon:"🧾", label:"Produção",       opensModal:false },
  { key:"relatorios",  icon:"📊", label:"Rastreabilidade",opensModal:false  },
  { key:"config",      icon:"⚙️", label:"Configurações",  opensModal:false  },
];

export default function DashboardProto() {
  // TEMA (dark / light)
  const [theme, setTheme] = React.useState(() => {
    try {
      return localStorage.getItem("ps_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("ps_theme", theme);
    } catch {}
  }, [theme]);

  // rail selecionado
  const [selectedRail, setSelectedRail] = React.useState("operacional");

  // modal
  const [modal, setModal] = React.useState(null); // { key, title }
  const openModal  = (key, title) => setModal({ key, title });
  const closeModal = () => setModal(null);

  const currentLabel = (RAIL.find(r => r.key === selectedRail)?.label) || "";

  return (
    <div className={`dash-root theme-${theme}`}>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <img
            src="/ChatGPT_Image_16_de_nov._de_2025__14_31_56-removebg-preview.png"
            className="brand-logo"
            alt="ProdSync"
          />
          <div className="env-chip">Filial: MATRIZ</div>
        </div>

        <div className="topbar-right">

          <button
            className="icon-btn"
            title="Ajuda"
            onClick={() => openModal("ajuda", "Ajuda")}
          >
            ❓
          </button>

          <div
            className="user-pill"
            onClick={() => openModal("perfil", "Perfil do usuário")}
          >
            JV
          </div>
        </div>
      </header>

      <div className="dash-body">
        {/* Rail */}
        <nav className="rail">
          {RAIL.map(({ key, icon, label, opensModal }) => (
            <button
              key={key}
              className={`rail-item ${selectedRail === key ? "active" : ""}`}
              title={label}
              onClick={() => {
                setSelectedRail(key);
                if (opensModal) openModal(key, label);
              }}
            >
              <div className="rail-icon">{icon}</div>
              <div className="rail-label">{label}</div>
            </button>
          ))}
        </nav>

        {/* Lateral — somente seção selecionada */}
        <aside className="side">
          <div className="side-head">{currentLabel}</div>
          <ul className="side-list">
            {(SECTION_ITEMS[selectedRail] ?? []).length === 0 ? (
              <li className="side-empty">
                Nenhuma função nesta seção por enquanto.
              </li>
            ) : (
              SECTION_ITEMS[selectedRail].map((m) => (
                <li key={m.key} className="side-item">
                  <div
                    className="side-click"
                    onClick={() => openModal(m.key, m.title)}
                  >
                    <div className="side-item-title">{m.title}</div>
                    <div className="side-item-sub">{m.sub}</div>
                  </div>
                  <button
                    className="ghost-btn"
                    onClick={() => openModal(m.key, m.title)}
                  >
                    Abrir
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Conteúdo central (placeholder) */}
        <main className="content">
          <section className="panel">
            <div className="panel-head">
              <h3>Bem-vindo ao ProdSync</h3>
            </div>
            <p className="modal-body-placeholder">
              Selecione uma função no menu lateral para começar
              (Entrada de produto, Cadastro de produtos, etc).
            </p>
          </section>
        </main>
      </div>

{modal && (
  <Modal onClose={closeModal} title={modal.title}>
    {modal.key === "entrada-produto" ? (
      <EntradaProdutoForm onClose={closeModal} />
    ) : modal.key === "cadastro-produtos" ? (
      <CadastroProdutos onClose={closeModal} />
    ) : modal.key === "exec-producao" ? (
      <ExecProducao onClose={closeModal} />
    ) : modal.key === "estoque-produtos" ? (
      <Estoque onClose={closeModal} />
    ) : modal.key === "rastrear-produtos" ? (
      <Rastreabilidade onClose={closeModal} />
    ) : modal.key === "configuracoes" ? (
      <ConfigTheme theme={theme} onChangeTheme={setTheme} />
    ) : modal.key === "usuarios-sistema" ? (
      <UsuariosSistema onClose={closeModal} />
    ) : (
  <div>Função não encontrada.</div>
)
}
  </Modal>
)}

    </div>
  );
}

/* ===== Modal genérico ===== */
function Modal({ title, onClose, children }) {
  React.useEffect(() => {
    const onEsc = (e)=>{ if(e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-window" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} title="Fechar">✕</button>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-foot">
          <button className="btn small" onClick={onClose}>Fechar (Esc)</button>
        </div>
      </div>
    </div>
  );
}

/* ======= TELA: ENTRADA DE PRODUTO ======= */
function EntradaProdutoForm({ onClose }) {
  const STORAGE = "translot_mov_entradas";
  const [item, setItem] = React.useState("");
  const [qtd, setQtd] = React.useState("");
  const [un, setUn]   = React.useState("kg");   // unidade
  const [lote, setLote] = React.useState("");
  const [fab, setFab]   = React.useState("");
  const [err, setErr] = React.useState("");
  const [ok, setOk] = React.useState("");
  const [recentes, setRecentes] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE)) ?? []; } catch { return []; }
  });

  // F9 = salvar
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "F9") { e.preventDefault(); handleSave(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    setErr(""); setOk("");
    if (!item.trim()) return setErr("Informe o item.");
    const n = Number(qtd);
    if (!qtd || isNaN(n) || n <= 0) return setErr("Quantidade inválida.");
    if (!un)  return setErr("Selecione a unidade.");
    if (!lote.trim()) return setErr("Informe o lote.");
    if (!fab.trim())  return setErr("Informe o fabricante.");

    const reg = {
      id: Date.now(),
      item: item.trim(),
      quantidade: n,
      unidade: un,
      lote: lote.trim(),
      fabricante: fab.trim(),
      data: new Date().toISOString(),
    };

    const next = [reg, ...recentes].slice(0, 10);
    setRecentes(next);
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch {}
    setOk("Entrada registrada.");

    setItem(""); setQtd(""); setUn("kg"); setLote(""); setFab("");
  }

  return (
    <div className="modal-form">
      <form onSubmit={(e)=>{ e.preventDefault(); handleSave(); }} className="form-grid form-entrada">
        {/* Item ocupa a LINHA TODA */}
        <div className="field full">
          <label className="label">Item</label>
          <input value={item} onChange={e=>setItem(e.target.value)} placeholder="Ex.: Ferro SAE 1020" />
        </div>

        {/* Quantidade + Unidade lado a lado */}
        <div className="field">
          <label className="label">Quantidade</label>
          <input type="number" step="any" value={qtd} onChange={e=>setQtd(e.target.value)} placeholder="Ex.: 50" />
        </div>
        <div className="field">
          <label className="label">Unidade</label>
          <select value={un} onChange={e=>setUn(e.target.value)}>
            <option value="t">Toneladas (t)</option>
            <option value="kg">Quilos (kg)</option>
            <option value="g">Gramas (g)</option>
            <option value="mg">Miligramas (mg)</option>
            <option value="un">Unidade (un)</option>
          </select>
        </div>

        {/* Lote + Fabricante lado a lado */}
        <div className="field">
          <label className="label">Lote</label>
          <input value={lote} onChange={e=>setLote(e.target.value)} placeholder="Ex.: L23-091" />
        </div>
        <div className="field">
          <label className="label">Fabricante</label>
          <input value={fab} onChange={e=>setFab(e.target.value)} placeholder="Ex.: Aço Brasil S.A." />
        </div>

        {err && <div className="alert error full">{err}</div>}
        {ok  && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose}>Cancelar (Esc)</button>
          <button type="submit" className="btn small">Salvar (F9)</button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Últimas entradas</div>
        {recentes.length === 0 ? (
          <div className="side-empty">Nenhum registro ainda.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Data</span><span>Item</span><span>Qtd</span><span>Lote</span><span>Fabricante</span>
            </div>
            {recentes.map(r=>(
              <div key={r.id} className="t-row">
                <span>{new Date(r.data).toLocaleString()}</span>
                <span>{r.item}</span>
                <span>{`${r.quantidade} ${r.unidade}`}</span>
                <span>{r.lote}</span>
                <span>{r.fabricante}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======= TELA: CADASTRO DE PRODUTOS (Produção) ======= */
function CadastroProdutos({ onClose }) {
  const STORAGE  = "translot_produtos";
  const ENTRADAS = "translot_mov_entradas";

  const [nome, setNome] = React.useState("");
  const [un, setUn]     = React.useState("un");
  const [tipo, setTipo] = React.useState("mp"); // mp = Matéria-prima, pa = Produto acabado

  // vínculo MP/lote (para produtos acabados)
  const [mpKey, setMpKey]   = React.useState("");   // "nomeLower||un"
  const [mpLote, setMpLote] = React.useState("");
  const [lotePa, setLotePa] = React.useState("");   // lote do produto (novo)
  const [qtdPa, setQtdPa]   = React.useState("");   // Qtd a produzir

  const [err, setErr] = React.useState("");
  const [ok, setOk]   = React.useState("");

  const [produtos, setProdutos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE)) ?? []; } catch { return []; }
  });

  const entradas = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem(ENTRADAS)) ?? []; } catch { return []; }
  }, []);

  // persistência
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(produtos)); } catch {}
  }, [produtos]);

  // materiais com estoque (agrupado por nome+un)
  const materiais = React.useMemo(() => {
    const map = new Map();
    for (const e of entradas) {
      const name = (e.item || "").trim();
      const key  = `${name.toLowerCase()}||${e.unidade}`;
      const tot  = Number(e.quantidade || 0);
      if (!name || !e.unidade || !isFinite(tot)) continue;
      const prev = map.get(key) || { nome: name, un: e.unidade, total: 0 };
      prev.total += tot;
      map.set(key, prev);
    }
    return Array.from(map.values()).filter(m => m.total > 0);
  }, [entradas]);

  // lotes disponíveis da MP selecionada
  const lotesMp = React.useMemo(() => {
    if (!mpKey) return [];
    const [nomeLower, unSel] = mpKey.split("||");
    const acc = new Map();
    for (const e of entradas) {
      const itemLower = (e.item || "").trim().toLowerCase();
      if (itemLower === nomeLower && e.unidade === unSel) {
        const qtd = Number(e.quantidade || 0);
        const k   = (e.lote || "").trim();
        if (!k) continue;
        const prev = acc.get(k) || 0;
        acc.set(k, prev + (isFinite(qtd) ? qtd : 0));
      }
    }
    return Array.from(acc.entries())
      .filter(([, tot]) => tot > 0)
      .map(([lote, total]) => ({ lote, total, un: unSel }));
  }, [mpKey, entradas]);

  // se trocar a MP e o lote atual não existir mais, limpa
  React.useEffect(() => {
    if (mpLote && !lotesMp.find(l => l.lote === mpLote)) setMpLote("");
  }, [mpKey, lotesMp, mpLote]);

  function totalEntrada(nomeRef, unRef) {
    const n = nomeRef.trim().toLowerCase();
    return entradas
      .filter(e => e.unidade === unRef && (e.item || "").trim().toLowerCase() === n)
      .reduce((s, e) => s + Number(e.quantidade || 0), 0);
  }

  function salvar() {
    setErr(""); setOk("");

    if (!nome.trim()) return setErr("Informe o nome do produto.");
    if (!un)          return setErr("Selecione a unidade.");

    // Se for PA, exige MP + lote MP + novo lote do produto + quantidade
    let mpNome = "", mpUn = "", mpL = "", lotePA = "", qtdPA = 0, mpId = null;
    if (tipo === "pa") {
      if (!mpKey)  return setErr("Selecione a matéria-prima.");
      if (!mpLote) return setErr("Selecione o lote da matéria-prima.");
      if (!lotePa.trim()) return setErr("Defina o novo lote do produto acabado.");
      const nQtd = Number(qtdPa);
      if (!qtdPa || isNaN(nQtd) || nQtd <= 0) {
        return setErr("Informe a quantidade a produzir (maior que zero).");
      }

      const [nomeLower, unSel] = mpKey.split("||");
      mpUn   = unSel;
      mpNome = (materiais.find(m => m.un === unSel && m.nome.toLowerCase() === nomeLower)?.nome) || "";
      mpL    = mpLote.trim();
      lotePA = lotePa.trim();
      qtdPA  = nQtd;

      // 🔗 tenta achar o produto de matéria-prima cadastrado
      const mpProd = produtos.find(p =>
        p.tipo === "mp" &&
        p.un === mpUn &&
        (p.nome || "").trim().toLowerCase() === (mpNome || "").trim().toLowerCase()
      );
      if (mpProd) {
        mpId = mpProd.id; // grava o id da MP
      }
    }



    // Checagem de duplicidade:
    // - MP: bloqueia mesmo nome+un
    // - PA: bloqueia mesmo nome+un+lotePa
    const nomeLower = nome.trim().toLowerCase();
    const exists = produtos.some(p => {
      if (p.tipo === "mp" && tipo === "mp") {
        return p.un === un && p.nome.trim().toLowerCase() === nomeLower;
      }
      if (p.tipo === "pa" && tipo === "pa") {
        return p.un === un
          && p.nome.trim().toLowerCase() === nomeLower
          && (p.lotePa || "").trim().toLowerCase() === lotePA.toLowerCase();
      }
      return false;
    });
    if (exists) return setErr(tipo === "pa"
      ? "Já existe este produto acabado com o mesmo lote."
      : "Já existe uma matéria-prima com esse nome e unidade.");

            const novo = {
      id: Date.now(),
      nome: nome.trim(),
      un,
      tipo,
      // vínculos PA
      mpNome,
      mpUn,
      mpLote: mpL,
      lotePa: lotePA,
      qtdPa: qtdPA,   // quantidade planejada
      mpId,           // 🔗 id da matéria-prima
    };



    setProdutos([novo, ...produtos]);
    setOk("Produto cadastrado.");
    setNome(""); setUn("un"); setTipo("mp");
    setMpKey(""); setMpLote(""); setLotePa(""); setQtdPa("");
  }

  function remover(id) {
    setProdutos(produtos.filter(p => p.id !== id));
  }

  return (
    <div className="modal-form">
      <form onSubmit={(e)=>{ e.preventDefault(); salvar(); }} className="form-grid form-produto">
        {/* Nome ocupa a linha toda */}
        <div className="field full">
          <label className="label">Nome do produto</label>
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex.: Parafuso 1/4 zincado" />
        </div>

        <div className="field">
          <label className="label">Unidade</label>
          <select value={un} onChange={e=>setUn(e.target.value)}>
            <option value="t">Toneladas (t)</option>
            <option value="kg">Quilos (kg)</option>
            <option value="g">Gramas (g)</option>
            <option value="mg">Miligramas (mg)</option>
            <option value="un">Unidade (un)</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Tipo</label>
          <select value={tipo} onChange={e=>setTipo(e.target.value)}>
            <option value="mp">Matéria-prima</option>
            <option value="pa">Produto acabado</option>
          </select>
        </div>

        {/* MP/Lotes/Qtd — só para Produto Acabado */}
        {tipo === "pa" && (
          <>
            <div className="field">
              <label className="label">Matéria-prima (em estoque)</label>
              <select
                value={mpKey}
                onChange={e=>setMpKey(e.target.value)}
                disabled={materiais.length === 0}
              >
                <option value="">{materiais.length ? "Selecione..." : "Sem estoque de MP"}</option>
                {materiais.map(m => {
                  const key = `${m.nome.toLowerCase()}||${m.un}`;
                  return (
                    <option key={key} value={key}>
                      {`${m.nome} (${m.un}) — ${m.total} ${m.un}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="field">
              <label className="label">Lote da MP</label>
              <select
                value={mpLote}
                onChange={e=>setMpLote(e.target.value)}
                disabled={!mpKey || lotesMp.length===0}
              >
                <option value="">{(!mpKey || lotesMp.length===0) ? "Selecione a MP" : "Selecione..."}</option>
                {lotesMp.map(l => (
                  <option key={l.lote} value={l.lote}>{`${l.lote} — ${l.total} ${l.un}`}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Lote do produto (novo)</label>
              <input
                value={lotePa}
                onChange={e=>setLotePa(e.target.value)}
                placeholder="Ex.: L-PA-0001"
              />
            </div>

            <div className="field">
              <label className="label">Qtd a produzir</label>
              <input
                type="number" step="any"
                value={qtdPa}
                onChange={e=>setQtdPa(e.target.value)}
                placeholder="Ex.: 100"
              />
            </div>
          </>
        )}

        {err && <div className="alert error full">{err}</div>}
        {ok  && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose}>Fechar</button>
          <button type="submit" className="btn small">Salvar</button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Produtos cadastrados</div>
        {produtos.length === 0 ? (
          <div className="side-empty">Nenhum produto cadastrado.</div>
        ) : (
          <div className="table-like">
            <div className="t-prod-head">
              <span>Nome</span><span>Un</span><span>Tipo</span><span>MP vinculada</span><span>Lote MP</span><span>Lote PA</span><span>Qtd PA</span><span>Entradas</span><span>Ações</span>
            </div>
            {produtos.map(p => (
              <div key={p.id} className="t-prod-row">
                <span>{p.nome}</span>
                <span>{p.un}</span>
                <span>{p.tipo === "mp" ? "Matéria-prima" : "Produto acabado"}</span>
                <span>{p.tipo === "pa" ? `${p.mpNome} (${p.mpUn})` : "-"}</span>
                <span>{p.tipo === "pa" ? (p.mpLote || "-") : "-"}</span>
                <span>{p.tipo === "pa" ? (p.lotePa || "-") : "-"}</span>
                <span>{p.tipo === "pa" ? (p.qtdPa ?? "-") : "-"}</span>
                <span>{totalEntrada(p.nome, p.un)} {p.un}</span>
                <span>
                  <button className="ghost-btn" onClick={()=>remover(p.id)}>Excluir</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======= TELA: EXECUÇÃO DE PRODUÇÃO ======= */
/**
 * Fluxo:
 * - Seleciona Produto Acabado (PA) já cadastrado
 * - Informa quantidade a produzir
 * - Escolhe Matéria-prima (MP) + lote + quantidade a consumir
 * - Gera lote automático para o PA (editável)
 * - Grava:
 *   - movimento NEGATIVO da MP (baixa estoque)
 *   - movimento POSITIVO do PA (entrada em estoque)
 *   - registro em "translot_mov_producao" (histórico)
 */
function ExecProducao({ onClose }) {
  const STORAGE_PROD      = "translot_produtos";
  const STORAGE_MOV       = "translot_mov_entradas";
  const STORAGE_PRODUCOES = "translot_mov_producao";

  const [produtos, setProdutos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PROD)) ?? []; } catch { return []; }
  });

  const [movs, setMovs] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_MOV)) ?? []; } catch { return []; }
  });

  const [producoes, setProducoes] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PRODUCOES)) ?? []; } catch { return []; }
  });

  // listas derivadas
  const produtosPA = React.useMemo(
    () => produtos.filter(p => p.tipo === "pa"),
    [produtos]
  );
  const produtosMP = React.useMemo(
    () => produtos.filter(p => p.tipo === "mp"),
    [produtos]
  );

  // campos do formulário
  const [produtoPaId, setProdutoPaId] = React.useState("");
  const [qtdPa, setQtdPa]             = React.useState("");

  const [mpId, setMpId]       = React.useState(""); // id do produto MP
  const [mpLote, setMpLote]   = React.useState("");
  const [qtdMp, setQtdMp]     = React.useState("");

  const [lotePa, setLotePa]   = React.useState(() => gerarLotePa());

  const [err, setErr] = React.useState("");
  const [ok, setOk]   = React.useState("");

    // Quando escolher um Produto Acabado, puxar a MP vinculada automaticamente
  React.useEffect(() => {
    if (!produtoPaId) return;

    const pa = produtosPA.find(p => String(p.id) === String(produtoPaId));
    if (!pa) return;

    // 1) Usa mpId salvo (caminho principal)
    if (pa.mpId) {
      setMpId(String(pa.mpId));
    } else if (pa.mpNome && pa.mpUn) {
      // 2) Fallback p/ produtos antigos: tenta casar por nome + unidade
      const mp = produtosMP.find(m =>
        m.tipo === "mp" &&
        (m.nome || "").trim().toLowerCase() === pa.mpNome.trim().toLowerCase() &&
        m.un === pa.mpUn
      );
      if (mp) {
        setMpId(String(mp.id));
      }
    }

    if (pa.qtdPa && !qtdPa) {
      setQtdPa(String(pa.qtdPa));
    }

    if (pa.mpLote && !mpLote) {
      setMpLote(pa.mpLote);
    }
  }, [produtoPaId, produtosPA, produtosMP, qtdPa, mpLote]);




  // gera lote automático tipo L-PA-20251117-0001
  function gerarLotePa() {
    const now = new Date();
    const data = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");
    const rand = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
    return `L-PA-${data}-${rand}`;
  }

  // estoques por lote da MP selecionada
  const lotesMp = React.useMemo(() => {
    if (!mpId) return [];
    const mp = produtosMP.find(p => String(p.id) === String(mpId));
    if (!mp) return [];

    const nomeLower = (mp.nome || "").trim().toLowerCase();
    const un        = mp.un;

    const mapa = new Map();
    for (const m of movs) {
      const itemLower = (m.item || "").trim().toLowerCase();
      if (itemLower === nomeLower && m.unidade === un) {
        const lote = (m.lote || "").trim();
        if (!lote) continue;
        const qtd = Number(m.quantidade || 0);
        const atual = mapa.get(lote) || 0;
        mapa.set(lote, atual + (isFinite(qtd) ? qtd : 0));
      }
    }

    return Array.from(mapa.entries())
      .filter(([, tot]) => tot > 0)
      .map(([lote, total]) => ({ lote, total, un }));
  }, [mpId, movs, produtosMP]);

  // se o lote escolhido some (ex.: muda MP), limpa
  React.useEffect(() => {
    if (mpLote && !lotesMp.find(l => l.lote === mpLote)) {
      setMpLote("");
    }
  }, [mpLote, lotesMp]);

  function handleProduzir(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!produtoPaId) return setErr("Selecione o produto acabado.");
    if (!qtdPa || Number(qtdPa) <= 0) return setErr("Informe a quantidade a produzir.");
    if (!mpId) return setErr("Selecione a matéria-prima.");
    if (!mpLote) return setErr("Selecione o lote da matéria-prima.");
    if (!qtdMp || Number(qtdMp) <= 0) return setErr("Informe a quantidade de MP a consumir.");
    if (!lotePa.trim()) return setErr("Defina/ajuste o lote do produto acabado.");

    const pa = produtosPA.find(p => String(p.id) === String(produtoPaId));
    const mp = produtosMP.find(p => String(p.id) === String(mpId));

    if (!pa || !mp) return setErr("Produto acabado ou matéria-prima inválidos.");

    const qtdMpNum = Number(qtdMp);
    const qtdPaNum = Number(qtdPa);

    // estoque disponível no lote MP
    const estoqueLote = lotesMp.find(l => l.lote === mpLote)?.total ?? 0;
    if (qtdMpNum > estoqueLote) {
      return setErr(`Estoque insuficiente no lote ${mpLote}. Disponível: ${estoqueLote} ${mp.un}.`);
    }

    const now = new Date().toISOString();

    // registra movimentos no estoque (negativo MP, positivo PA)
    const movConsumoMp = {
      id: Date.now(),
      item: mp.nome,
      quantidade: -qtdMpNum,
      unidade: mp.un,
      lote: mpLote,
      fabricante: "", // opcional
      data: now,
      tipoMov: "consumo_producao",
    };

    const movEntradaPa = {
      id: Date.now() + 1,
      item: pa.nome,
      quantidade: qtdPaNum,
      unidade: pa.un,
      lote: lotePa.trim(),
      fabricante: "",
      data: now,
      tipoMov: "producao",
    };

    const novosMovs = [movEntradaPa, movConsumoMp, ...movs];
    setMovs(novosMovs);
    try {
      localStorage.setItem(STORAGE_MOV, JSON.stringify(novosMovs));
    } catch {}

    // registra histórico de produção (JSON da produção)
    const producao = {
      id: Date.now(),
      data: now,
      produtoId: pa.id,
      produtoNome: pa.nome,
      paUn: pa.un,           // 👈 unidade do produto acabado
      lotePa: lotePa.trim(),
      qtdPa: qtdPaNum,
      mpId: mp.id,
      mpNome: mp.nome,
      mpUn: mp.un,
      mpLote,
      qtdMp: qtdMpNum,
    };


    const novasProducoes = [producao, ...producoes];
    setProducoes(novasProducoes);
    try {
      localStorage.setItem(STORAGE_PRODUCOES, JSON.stringify(novasProducoes));
    } catch {}

    setOk("Produção registrada com sucesso.");
    // limpa só quantidades, mantém itens selecionados
    setQtdPa("");
    setQtdMp("");
    setLotePa(gerarLotePa());
  }

  return (
    <div className="modal-form">
      <form onSubmit={handleProduzir} className="form-grid form-producao">
        <div className="field full">
          <label className="label">Produto acabado</label>
          <select
            value={produtoPaId}
            onChange={e => setProdutoPaId(e.target.value)}
          >
            <option value="">{produtosPA.length ? "Selecione..." : "Nenhum produto acabado cadastrado"}</option>
            {produtosPA.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.un})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Qtd a produzir</label>
          <input
            type="number"
            step="any"
            value={qtdPa}
            onChange={e => setQtdPa(e.target.value)}
            placeholder="Ex.: 10"
          />
        </div>

        <div className="field">
          <label className="label">Lote do produto (auto)</label>
          <input
            value={lotePa}
            onChange={e => setLotePa(e.target.value)}
          />
        </div>

        <div className="field full">
          <hr className="field-separator" />
        </div>

        <div className="field">
          <label className="label">Matéria-prima</label>
          <select
            value={mpId}
            onChange={e => setMpId(e.target.value)}
          >
            <option value="">{produtosMP.length ? "Selecione..." : "Nenhuma matéria-prima cadastrada"}</option>
            {produtosMP.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.un})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Lote da MP</label>
          <select
            value={mpLote}
            onChange={e => setMpLote(e.target.value)}
            disabled={!mpId || lotesMp.length === 0}
          >
            <option value="">
              {(!mpId || lotesMp.length === 0)
                ? "Selecione a MP"
                : "Selecione o lote"}
            </option>
            {lotesMp.map(l => (
              <option key={l.lote} value={l.lote}>
                {l.lote} — {l.total} {l.un}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label">Qtd MP a consumir</label>
          <input
            type="number"
            step="any"
            value={qtdMp}
            onChange={e => setQtdMp(e.target.value)}
            placeholder="Ex.: 5"
          />
        </div>

        {err && <div className="alert error full">{err}</div>}
        {ok  && <div className="alert ok full">✅ {ok}</div>}

        <div className="actions full">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Fechar
          </button>
          <button type="submit" className="btn small">
            Registrar produção
          </button>
        </div>
      </form>

      <div className="recent-card">
        <div className="recent-head">Últimas produções</div>
        {producoes.length === 0 ? (
          <div className="side-empty">Nenhuma produção registrada.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Data</span>
              <span>Produto</span>
              <span>Lote PA</span>
              <span>Qtd PA</span>
              <span>MP / lote</span>
              <span>Qtd MP</span>
            </div>
            {producoes.map(p => (
              <div key={p.id} className="t-row">
                <span>{new Date(p.data).toLocaleString()}</span>
                <span>{p.produtoNome}</span>
                <span>{p.lotePa}</span>
                <span>{p.qtdPa}</span>
                <span>{p.mpNome} ({p.mpLote})</span>
                <span>{p.qtdMp} {p.mpUn}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


/* ======= CONFIGURAÇÕES: TEMA ======= */
function ConfigTheme({ theme, onChangeTheme }) {
  return (
    <div className="modal-form">
      <h3 className="config-title">Aparência</h3>

      <p className="config-subtitle">
        Escolha como o ProdSync será exibido neste dispositivo.
      </p>

      <div className="theme-options">
        <button
          type="button"
          className={`theme-card ${theme === "dark" ? "active" : ""}`}
          onClick={() => onChangeTheme("dark")}
        >
          <div className="theme-dot theme-dot-dark" />
          <div className="theme-card-text">
            <span className="theme-card-title">Modo escuro</span>
            <span className="theme-card-desc">
              Fundo escuro, ideal para uso prolongado.
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`theme-card ${theme === "light" ? "active" : ""}`}
          onClick={() => onChangeTheme("light")}
        >
          <div className="theme-dot theme-dot-light" />
          <div className="theme-card-text">
            <span className="theme-card-title">Modo claro</span>
            <span className="theme-card-desc">
              Fundo claro, mais próximo de sistemas padrão.
            </span>
          </div>
        </button>
      </div>

      <p className="config-hint">
        O tema selecionado fica salvo no navegador e será aplicado sempre que você
        abrir o ProdSync.
      </p>
    </div>
  );
}

/* ======= TELA: ESTOQUE ======= */
/**
 * Mostra:
 * - Todas as matérias-primas com saldo em estoque (por lote)
 * - Todos os produtos acabados com saldo em estoque (por lote)
 *   + qual MP foi usada e o lote da MP (via histórico de produção)
 *
 * Filtros:
 * - Pesquisar por nome ou por lote
 * - Filtrar: todos / só MP / só PA
 */
function Estoque({ onClose }) {
  const STORAGE_PROD      = "translot_produtos";
  const STORAGE_MOV       = "translot_mov_entradas";
  const STORAGE_PRODUCOES = "translot_mov_producao";

  const [produtos] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PROD)) ?? []; } catch { return []; }
  });

  const [movs] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_MOV)) ?? []; } catch { return []; }
  });

  const [producoes] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PRODUCOES)) ?? []; } catch { return []; }
  });

  // Índice para achar rapidamente qual MP foi usada em um lote de PA
  const indexProdLote = React.useMemo(() => {
    const map = new Map();
    for (const p of producoes) {
      const key = `${String(p.produtoId)}||${(p.lotePa || "").trim().toLowerCase()}`;
      if (!map.has(key)) map.set(key, p); // guarda o primeiro registro encontrado
    }
    return map;
  }, [producoes]);

  // Monta as linhas de estoque: produto + lote + saldo
  const linhasBase = React.useMemo(() => {
    const resultado = [];

    for (const prod of produtos) {
      const nomeLower = (prod.nome || "").trim().toLowerCase();
      const un        = prod.un;

      if (!nomeLower || !un) continue;

      const mapaLotes = new Map();

      for (const m of movs) {
        const itemLower = (m.item || "").trim().toLowerCase();
        if (itemLower !== nomeLower) continue;
        if (m.unidade !== un) continue;

        const lote = (m.lote || "").trim();
        if (!lote) continue;

        const qtd = Number(m.quantidade || 0);
        if (!isFinite(qtd)) continue;

        const atual = mapaLotes.get(lote) || 0;
        mapaLotes.set(lote, atual + qtd);
      }

      for (const [lote, saldo] of mapaLotes.entries()) {
        if (saldo <= 0) continue;

        const linha = {
          idProduto: prod.id,
          nome: prod.nome,
          tipo: prod.tipo, // "mp" ou "pa"
          un: prod.un,
          lote,
          saldo,
          mpNome: "-",
          mpLote: "-",
        };

        // Se for produto acabado, tenta achar qual MP/lote foi usada
        if (prod.tipo === "pa") {
          const key = `${String(prod.id)}||${lote.trim().toLowerCase()}`;
          const hist = indexProdLote.get(key);
          if (hist) {
            linha.mpNome = hist.mpNome || "-";
            linha.mpLote = hist.mpLote || "-";
          }
        }

        resultado.push(linha);
      }
    }

    return resultado;
  }, [produtos, movs, indexProdLote]);

  // Filtros de pesquisa
  const [searchTerm, setSearchTerm]   = React.useState("");
  const [searchField, setSearchField] = React.useState("nome"); // "nome" | "lote"
  const [filtroTipo, setFiltroTipo]   = React.useState("todos"); // "todos" | "mp" | "pa"

  const linhasFiltradas = React.useMemo(() => {
    let base = [...linhasBase];

    if (filtroTipo !== "todos") {
      base = base.filter(l => l.tipo === filtroTipo);
    }

    const term = searchTerm.trim().toLowerCase();
    if (!term) return base;

    if (searchField === "lote") {
      return base.filter(l => (l.lote || "").toLowerCase().includes(term));
    }

    // padrão: pesquisa por nome
    return base.filter(l => (l.nome || "").toLowerCase().includes(term));
  }, [linhasBase, filtroTipo, searchField, searchTerm]);

  return (
    <div className="modal-form">
      {/* Filtros */}
      <div className="form-grid form-estoque-filtros">
        <div className="field full">
          <label className="label">Pesquisar</label>
          <input
            placeholder={searchField === "nome" ? "Digite o nome do item..." : "Digite o lote..."}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Pesquisar por</label>
          <select
            value={searchField}
            onChange={e => setSearchField(e.target.value)}
          >
            <option value="nome">Nome</option>
            <option value="lote">Lote</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Mostrar</label>
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="mp">Somente matéria-prima</option>
            <option value="pa">Somente produto acabado</option>
          </select>
        </div>
      </div>

      {/* Grid de estoque */}
      <div className="recent-card">
        <div className="recent-head">Estoque por lote</div>

        {linhasFiltradas.length === 0 ? (
          <div className="side-empty">
            Nenhum item encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="table-like">
            <div className="t-prod-head">
              <span>Nome</span>
              <span>Tipo</span>
              <span>Un</span>
              <span>Lote</span>
              <span>Saldo</span>
              <span>Matéria-prima usada</span>
              <span>Lote da MP</span>
            </div>

            {linhasFiltradas.map((l, idx) => (
              <div key={`${l.idProduto}-${l.lote}-${idx}`} className="t-prod-row">
                <span>{l.nome}</span>
                <span>{l.tipo === "mp" ? "Matéria-prima" : "Produto acabado"}</span>
                <span>{l.un}</span>
                <span>{l.lote}</span>
                <span>{l.saldo} {l.un}</span>
                <span>{l.tipo === "pa" ? l.mpNome : "-"}</span>
                <span>{l.tipo === "pa" ? l.mpLote : "-"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions full" style={{ marginTop: "1rem" }}>
        <button type="button" className="ghost-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

/* ======= TELA: RASTREABILIDADE ======= */
/**
 * Permite rastrear:
 * - A partir de um produto acabado (por lote ou nome): ver qual MP e lote de MP foram usados.
 * - A partir de uma matéria-prima (por lote ou nome): ver todos os PAs produzidos com ela.
 * Mostra: data, produto, unidade, lote PA, qtd PA, MP, unidade MP, lote MP, qtd MP.
 */
function Rastreabilidade({ onClose }) {
  const STORAGE_PRODUCOES = "translot_mov_producao";

  const [producoes] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PRODUCOES)) ?? [];
    } catch {
      return [];
    }
  });

  // filtros da tela
  const [tipoBusca, setTipoBusca] = React.useState("pa"); // "pa" = produto acabado, "mp" = matéria-prima
  const [termo, setTermo]         = React.useState("");

  const linhas = React.useMemo(() => {
    const base = Array.isArray(producoes) ? producoes : [];
    const t = termo.trim().toLowerCase();
    if (!t) return base;

    if (tipoBusca === "pa") {
      // busca por produto acabado: lote PA ou nome do produto
      return base.filter(p =>
        (p.lotePa || "").toLowerCase().includes(t) ||
        (p.produtoNome || "").toLowerCase().includes(t)
      );
    }

    // busca por matéria-prima: lote da MP ou nome da MP
    return base.filter(p =>
      (p.mpLote || "").toLowerCase().includes(t) ||
      (p.mpNome || "").toLowerCase().includes(t)
    );
  }, [producoes, tipoBusca, termo]);

  return (
    <div className="modal-form">
      <h3 className="config-title">Rastreabilidade</h3>
      <p className="config-subtitle">
        Consulte o vínculo entre matéria-prima e produto acabado por lote ou nome.
      </p>

      {/* Filtros */}
      <div className="form-grid form-estoque-filtros">
        <div className="field">
          <label className="label">Buscar por</label>
          <select
            value={tipoBusca}
            onChange={e => setTipoBusca(e.target.value)}
          >
            <option value="pa">Produto acabado (PA)</option>
            <option value="mp">Matéria-prima (MP)</option>
          </select>
        </div>

        <div className="field full">
          <label className="label">
            {tipoBusca === "pa" ? "Lote ou nome do produto" : "Lote ou nome da MP"}
          </label>
          <input
            value={termo}
            onChange={e => setTermo(e.target.value)}
            placeholder={
              tipoBusca === "pa"
                ? "Ex.: L-PA-0001 ou Parafuso 1/4..."
                : "Ex.: L-MP-001 ou Aço SAE 1020..."
            }
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="recent-card">
        <div className="recent-head">
          {tipoBusca === "pa"
            ? "Produções encontradas (Produto acabado → MP)"
            : "Produções encontradas (MP → Produtos acabados)"}
        </div>

        {linhas.length === 0 ? (
          <div className="side-empty">
            Nenhum registro encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Data</span>
              <span>Produto acabado</span>
              <span>Un. PA</span>
              <span>Lote PA</span>
              <span>Qtd PA</span>
              <span>Matéria-prima</span>
              <span>Un. MP</span>
              <span>Lote MP</span>
              <span>Qtd MP</span>
            </div>

            {linhas.map((p, idx) => (
              <div key={`${p.id}-${idx}`} className="t-row">
                <span>{new Date(p.data).toLocaleString()}</span>
                <span>{p.produtoNome}</span>
                <span>{p.paUn || "-"}</span>
                <span>{p.lotePa}</span>
                <span>{p.qtdPa} {p.paUn}</span>
                <span>{p.mpNome}</span>
                <span>{p.mpUn}</span>
                <span>{p.mpLote}</span>
                <span>{p.qtdMp} {p.mpUn}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions full" style={{ marginTop: "1rem" }}>
        <button type="button" className="ghost-btn" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}

/* ============================
   TELA: USUÁRIOS DO SISTEMA
   ============================ */

function UsuariosSistema({ onClose }) {
  const STORAGE_KEY = "translot_usuarios";

  const [usuarios, setUsuarios] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [admin, setAdmin] = React.useState(false);

  // salvar
  function salvarUsuario() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const novo = {
      id: Date.now(),
      nome: nome.trim(),
      email: email.trim(),
      senha: senha.trim(),     // aqui depois podemos colocar hashing
      admin: admin ? true : false
    };

    const lista = [...usuarios, novo];
    setUsuarios(lista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));

    setNome("");
    setEmail("");
    setSenha("");
    setAdmin(false);
  }

  return (
    <div className="modal-form">
      <h3 className="config-title">Gerenciar usuários</h3>
      <p className="config-subtitle">Cadastre usuários e defina permissões.</p>

      <div className="form-grid">
        <div className="field">
          <label className="label">Nome</label>
          <input value={nome} onChange={e => setNome(e.target.value)} />
        </div>

        <div className="field">
          <label className="label">E-mail</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="field">
          <label className="label">Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} />
        </div>

        <div className="field">
          <label className="label">Administrador?</label>
          <select value={admin} onChange={e => setAdmin(e.target.value === "true")}>
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>

        <div className="actions full">
          <button className="primary-btn" type="button" onClick={salvarUsuario}>
            Salvar usuário
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="recent-card" style={{ marginTop: "1rem" }}>
        <div className="recent-head">Usuários cadastrados</div>

        {usuarios.length === 0 ? (
          <div className="side-empty">Nenhum usuário cadastrado.</div>
        ) : (
          <div className="table-like">
            <div className="t-head">
              <span>Nome</span>
              <span>Email</span>
              <span>Admin</span>
            </div>

            {usuarios.map(u => (
              <div key={u.id} className="t-row">
                <span>{u.nome}</span>
                <span>{u.email}</span>
                <span>{u.admin ? "Sim" : "Não"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions full" style={{ marginTop: "1rem" }}>
        <button className="ghost-btn" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
