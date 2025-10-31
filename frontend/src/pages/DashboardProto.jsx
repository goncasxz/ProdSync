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

/* === SEÇÕES LATERAIS ===
   Produção (key=fiscal) agora tem "Cadastro de produtos" */
const SECTION_ITEMS = {
  operacional: [
    { key: "entrada-produto", title: "Entrada de produto", sub: "Operacional" },
    { key: "oper-cadastrar",  title: "Cadastrar",          sub: "Operacional" },
  ],
  financeiro: [],
  fiscal: [ // Produção
    { key: "cadastro-produtos", title: "Cadastro de produtos", sub: "Produção" },
  ],
  relatorios: [],
  mensagens: [],
  config: [],
};

const ALL_FAVORITABLE = [
  ...MENU_ITEMS,
  ...Object.values(SECTION_ITEMS).flat(),
];

const TABS     = ["Dashboard","Meus indicadores","Vendas","Entradas/Compras","Financeiro","Lucratividade"];
const PERIODOS = ["10D","15D","30D"];
const VENDAS_POR_PAGAMENTO = [
  ["Cartão Débito Visa",   0],
  ["Cartão Crédito",       0],
  ["Cartão Débito Master", 0],
  ["PIX",                  0],
  ["Dinheiro",             0],
];

/* Rail: Produção NÃO abre modal — mostra a lista da seção */
const RAIL = [
  { key:"favoritos",   icon:"⭐", label:"Favoritos",      opensModal:false },
  { key:"operacional", icon:"📦", label:"Operacional",    opensModal:false },
  { key:"financeiro",  icon:"💰", label:"Estoque",        opensModal:true  },
  { key:"fiscal",      icon:"🧾", label:"Produção",       opensModal:false },
  { key:"relatorios",  icon:"📊", label:"Rastreabilidade",opensModal:true  },
  { key:"mensagens",   icon:"✉️", label:"Mensagens",      opensModal:true  },
  { key:"config",      icon:"⚙️", label:"Configurações",  opensModal:true  },
];

export default function DashboardProto() {
  // favoritos
  const favKey = "translot_favs";
  const [favs, setFavs] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(favKey)) ?? []; } catch { return []; }
  });
  React.useEffect(() => localStorage.setItem(favKey, JSON.stringify(favs)), [favs]);
  const toggleFav = (k) => setFavs(p => p.includes(k) ? p.filter(x=>x!==k) : [...p, k]);
  const isFav = (k) => favs.includes(k);
  const favItems = ALL_FAVORITABLE.filter(m => favs.includes(m.key));

  // rail selecionado
  const [selectedRail, setSelectedRail] = React.useState("favoritos");

  // modal
  const [modal, setModal] = React.useState(null); // {key,title}
  const openModal  = (key, title) => setModal({ key, title });
  const closeModal = () => setModal(null);

  const currentLabel = (RAIL.find(r=>r.key===selectedRail)?.label) || "";

  return (
    <div className="dash-root">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <img src="  /Translot.png" className="brand-logo" alt="ProdSync" />
          <div className="env-chip">Filial: MATRIZ</div>
        </div>

        <div className="search-wrap">
          <input
            className="search-input"
            placeholder="Pesquisar"
            onKeyDown={(e)=>{ if(e.key==='Enter'){ openModal('busca', `Busca: ${e.currentTarget.value}`); } }}
          />
        </div>

        <div className="topbar-right">
          <button className="icon-btn" title="Configurações" onClick={()=>openModal('config','Configurações')}>⚙️</button>
          <button className="icon-btn" title="Ajuda" onClick={()=>openModal('ajuda','Ajuda')}>❓</button>
          <div className="user-pill" onClick={()=>openModal('perfil','Perfil do usuário')}>JV</div>
        </div>
      </header>

      <div className="dash-body">
        {/* Rail */}
        <nav className="rail">
          {RAIL.map(({ key, icon, label, opensModal }) => (
            <button
              key={key}
              className={`rail-item ${selectedRail===key ? "active":""}`}
              title={label}
              onClick={()=>{
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
          {selectedRail === "favoritos" ? (
            <>
              <div className="side-head">Favoritos</div>
              <ul className="side-list">
                {favItems.length === 0 ? (
                  <li className="side-empty">Nenhum favorito. Clique na ⭐ das funções para favoritar.</li>
                ) : favItems.map(m => (
                  <li key={`fav-${m.key}`} className="side-item">
                    <button className="star-btn active" onClick={()=>toggleFav(m.key)} title="Remover favorito">★</button>
                    <div className="side-click" onClick={()=>openModal(m.key, m.title)}>
                      <div className="side-item-title">{m.title}</div>
                      <div className="side-item-sub">{m.sub}</div>
                    </div>
                    <button className="ghost-btn" onClick={()=>openModal(m.key, m.title)}>Abrir</button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="side-head">{currentLabel}</div>
              <ul className="side-list">
                {(SECTION_ITEMS[selectedRail] ?? []).length === 0 ? (
                  <li className="side-empty">Nenhuma função nesta seção por enquanto.</li>
                ) : (
                  SECTION_ITEMS[selectedRail].map(m => (
                    <li key={m.key} className="side-item">
                      <button
                        className={`star-btn ${isFav(m.key) ? "active" : ""}`}
                        onClick={()=>toggleFav(m.key)}
                        title={isFav(m.key) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >★</button>
                      <div className="side-click" onClick={()=>openModal(m.key, m.title)}>
                        <div className="side-item-title">{m.title}</div>
                        <div className="side-item-sub">{m.sub}</div>
                      </div>
                      <button className="ghost-btn" onClick={()=>openModal(m.key, m.title)}>Abrir</button>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </aside>

        {/* Conteúdo */}
        <main className="content">
          <div className="tabs">
            {TABS.map((t, i) => (
              <button
                key={t}
                className={`tab ${i===0?"active":""}`}
                onClick={()=>openModal(`aba-${t}`, t)}
              >{t}</button>
            ))}
          </div>

          <section className="panel">
            <div className="panel-head">
              <h3>MEUS INDICADORES</h3>
              <div className="range">
                {PERIODOS.map((p, i)=>(
                  <button key={p} className={`chip ${i===2?"active":""}`} onClick={()=>openModal(`periodo-${p}`, `Período ${p}`)}>{p}</button>
                ))}
                <button className="btn small" onClick={()=>openModal('recalcular','Recalcular período')}>Recalcular período</button>
              </div>
            </div>

            <div className="card chart">
              <div className="chart-title">Vendas por Tipo de Pagamento</div>
              <div className="bars">
                {VENDAS_POR_PAGAMENTO.map(([label, w]) => (
                  <div className="bar-row" key={label}>
                    <span className="bar-label">{label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* MODAL */}
      {modal && (
        <Modal onClose={closeModal} title={modal.title}>
          {modal.key === "entrada-produto" ? (
            <EntradaProdutoForm onClose={closeModal} />
          ) : modal.key === "cadastro-produtos" ? (
            <CadastroProdutos onClose={closeModal} />
          ) : (
            <div className="modal-body-placeholder">
              <p><b>{modal.title}</b> — conteúdo da tela “{modal.key}”.</p>
              <p>Depois trocamos aqui pelo layout real da sua tela.</p>
            </div>
          )}
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
  }, []);

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
    let mpNome = "", mpUn = "", mpL = "", lotePA = "", qtdPA = 0;
    if (tipo === "pa") {
      if (!mpKey)  return setErr("Selecione a matéria-prima.");
      if (!mpLote) return setErr("Selecione o lote da matéria-prima.");
      if (!lotePa.trim()) return setErr("Defina o novo lote do produto acabado.");
      const nQtd = Number(qtdPa);
      if (!qtdPa || isNaN(nQtd) || nQtd <= 0) return setErr("Informe a quantidade a produzir (maior que zero).");

      const [nomeLower, unSel] = mpKey.split("||");
      mpUn   = unSel;
      mpNome = (materiais.find(m => m.un === unSel && m.nome.toLowerCase() === nomeLower)?.nome) || "";
      mpL    = mpLote.trim();
      lotePA = lotePa.trim();
      qtdPA  = nQtd;
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
      mpNome, mpUn, mpLote: mpL,
      lotePa: lotePA,
      qtdPa: qtdPA, // salva quantidade planejada
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
