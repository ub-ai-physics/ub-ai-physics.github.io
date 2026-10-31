/* ℏbar · Física UB
   Web original de Jose; adaptada per l'equip UB AI Physics perquè llegeixi les dades de data/.
   El codi gairebé no s'ha de tocar per afegir contingut: vegeu CONTRIBUIR.md i meta/estructura.md. */
(function(){
"use strict";

const PLA = "actual";             // pla d'estudis que es mostra (en el futur: selector amb el nou grau)
const NEEDED = 4;                 // assignatures del minor
const CONTRIBUIR_URL = "https://github.com/ub-ai-physics/ub-ai-physics.github.io/blob/main/CONTRIBUIR.md";
const GUIA_ACADEMICA = "https://www.ub.edu/guiaacademica/?codEnsenyament=TG1035&curs=2026&idioma=CAT";
const CLAUDE_GUIA = "guies/estudiar-amb-claude/";
const G = window.HBAR_GLIFS || {};

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; };
const svg = g => `<svg viewBox="0 0 64 64" aria-hidden="true">${G[g]}</svg>`;
const FOLDER_SVG='<svg viewBox="0 0 48 40" aria-hidden="true"><path d="M3 8a3 3 0 0 1 3-3h12l5 5h19a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="currentColor" opacity=".16"/><path d="M3 8a3 3 0 0 1 3-3h12l5 5h19a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 15h42" stroke="currentColor" stroke-width="1.5" opacity=".5"/></svg>';

/* ---------- desat local (només en aquest navegador) ---------- */
function load(k, d){ try{ const r=localStorage.getItem(k); return r?JSON.parse(r):d; }catch(e){ return d; } }
function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

/* ---------- idiomes ---------- */
const LANGS = ["ca","es","en"];
let LANG = load("hbar-lang","ca"); if(!LANGS.includes(LANG)) LANG="ca";
let DICT = {}, DICT_CA = {};
function tv(k){ return (k in DICT) ? DICT[k] : (k in DICT_CA ? DICT_CA[k] : k); }
function t(k, vars){ let s=String(tv(k)); if(vars) for(const v in vars) s=s.split("{"+v+"}").join(vars[v]); return s; }
const tr = (o, f) => (o && (o[f+"_"+LANG] || o[f])) || "";   // camp traduït amb retorn al català
function applyStatic(){
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach(n=>{ const k=n.dataset.i18n; if(k in DICT) n.textContent=DICT[k]; });
  document.querySelectorAll("[data-i18n-html]").forEach(n=>{ const k=n.dataset.i18nHtml; if(k in DICT) n.innerHTML=DICT[k]; });
  document.querySelectorAll("[data-i18n-ph]").forEach(n=>{ const k=n.dataset.i18nPh; if(k in DICT) n.placeholder=DICT[k]; });
  document.querySelectorAll("[data-i18n-aria]").forEach(n=>{ const k=n.dataset.i18nAria; if(k in DICT) n.setAttribute("aria-label",DICT[k]); });
  const sel=$("lang"); if(sel){ sel.value=LANG; sel.onchange=()=>{ save("hbar-lang", sel.value); location.reload(); }; }
}

/* ---------- dades ---------- */
let SUBJECTS=[], DEGREE=[], MINOR=[], SIMS=[], RECURSOS={}, recursosBundle=false;
const QUIZ = {};                  // id assignatura -> {preguntes, estat}
const byId = id => SUBJECTS.find(s=>s.id===id);
const TYPES_KEYS = ["FB","OB","FA","FF","OT","EM","TFG"];
const typeLabel = ty => t("tipus."+ty);
const typeShort = ty => t("tipus.curt."+ty);

async function getJSON(url){ const r=await fetch(url,{cache:"no-cache"}); if(!r.ok) throw new Error(url+" "+r.status); return r.json(); }
function adapt(o){
  return { id:o.id, name:tr(o,"nom"), ects:o.ects, type:o.tipus, sem:o.semestre||null, code:o.codi||null,
    req: o.requisits ? {ids:o.requisits.assignatures||[], credits:o.requisits.credits||0} : null,
    sum: tr(o,"resum"), g:o.glif||null, minor:!!o.minor, pla:o.pla||"actual" };
}

/* material de classe d'una assignatura, en el format intern */
const KIND_OF = {apunts:"apunts", problemes:"problemes", examens:"examens", bibliografia:"biblio", pla:"pla"};
function resOf(sid){
  const r=RECURSOS[sid]; if(!r || !r.material) return [];
  const out=[];
  for(const k in KIND_OF){ (r.material[k]||[]).forEach((x,i)=>{ if(!x) return;
    out.push({ id: x.id || (sid+":"+k+":"+(x.url||i)), subject:sid, kind:KIND_OF[k], title:tr(x,"titol"), url:x.url||"",
      solUrl:x.solucio||"", tema:(x.tema===undefined?null:x.tema), year:x.curs||"", conv:tr(x,"convocatoria"), note:tr(x,"nota"), order:i }); }); }
  return out;
}
const temesOf = sid => { const r=RECURSOS[sid]; const a=r&&(r["temes_"+LANG]||r.temes); return Array.isArray(a)?a.filter(x=>typeof x==="string"):[]; };
const simsOf = sid => SIMS.filter(s=>(s.assignatures||[]).includes(sid));
const simsReady = sid => simsOf(sid).filter(s=>s.estat!=="per-portar" && s.fitxer);
const extresOf = sid => { const r=RECURSOS[sid]; return (r&&Array.isArray(r.extres)?r.extres:[]).filter(e=>e && (e.url || (e.items&&e.items.length))); };
const quizInfo = sid => { const r=RECURSOS[sid]; return (r&&r.autoavaluacio)||{}; };
const quizApps = sid => { const q=quizInfo(sid); return [...(q.app?[{url:q.app}]:[]), ...(Array.isArray(q.apps)?q.apps:[])].filter(x=>x&&x.url); };
const hasQuiz = sid => !!(quizApps(sid).length || quizInfo(sid).preguntes);
const countFor = sid => resOf(sid).length + simsReady(sid).length;

async function ensureRecursos(sid){
  if(recursosBundle || sid in RECURSOS) return;
  try{ RECURSOS[sid]=await getJSON("data/recursos/"+sid+".json"); }catch(e){ RECURSOS[sid]=null; }
}
const QUIZ_P = {};
function ensureQuiz(sid){
  if(QUIZ_P[sid]) return QUIZ_P[sid];
  const q=quizInfo(sid);
  QUIZ_P[sid] = !q.preguntes ? Promise.resolve(QUIZ[sid]={estat:"buit", preguntes:[]})
    : getJSON(q.preguntes).then(d=>QUIZ[sid]={estat:"ok", preguntes:Array.isArray(d.preguntes)?d.preguntes:[]})
                          .catch(()=>QUIZ[sid]={estat:"error", preguntes:[]});
  return QUIZ_P[sid];
}
function safeUrl(u){ if(typeof u!=="string"||!u) return null; try{ const x=new URL(u, location.href); return (x.protocol==="https:"||x.protocol==="http:")?x.href:null; }catch(e){ return null; } }

/* ---------- progrés personal ---------- */
let picks = new Set(load("minor-picks", []));
let doneRes = new Set(load("minor-done-res", []));
function toggleRes(id){ doneRes.has(id)?doneRes.delete(id):doneRes.add(id); save("minor-done-res",[...doneRes]); renderAll(); }
function togglePick(id){ picks.has(id)?picks.delete(id):picks.add(id); save("minor-picks",[...picks]); renderAll(); }
let passed = new Set(load("fis-passed", []));
let mencio = load("fis-mencio", "FF");
let lastToggled=null;
const unlockedSet=()=>new Set(SUBJECTS.filter(s=>!passed.has(s.id)&&s.req&&reqState(s).ok).map(s=>s.id));
function togglePassed(id){
  const before=unlockedSet(), adding=!passed.has(id);
  adding?passed.add(id):passed.delete(id); save("fis-passed",[...passed]); lastToggled=id;
  if(adding){ const now=[...unlockedSet()].filter(x=>!before.has(x)&&x!==id).map(byId).filter(Boolean);
    if(now.length) toast(t("toast.desbloq",{llista:now.slice(0,4).map(x=>x.name).join(", ")+(now.length>4?t("toast.imes",{n:now.length-4}):"")})); }
  renderAll(); setTimeout(()=>{ lastToggled=null; },600);
}
let toastT=0;
function toast(msg){ const x=$("toast"); x.textContent=msg; x.classList.remove("show"); void x.offsetWidth; x.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>x.classList.remove("show"),4200); }
function setMencio(m){ mencio=m; save("fis-mencio",m); renderAll(); }
const passedCredits = () => [...passed].reduce((a,id)=>a+((byId(id)||{}).ects||0),0);
function reqState(s){
  if(!s.req) return {ok:true, missing:[], credits:0};
  const missing=(s.req.ids||[]).filter(id=>!passed.has(id));
  const need=s.req.credits||0, have=passedCredits();
  return {ok:!missing.length && have>=need, missing, credits: need>have? need-have : 0};
}
function credits(){
  const c={FB:0,OB:0,MEN:0,OPT:0,TFG:0,MINOR:0};
  passed.forEach(id=>{ const s=byId(id); if(!s) return;
    if(s.type==="FB") c.FB+=s.ects; else if(s.type==="OB") c.OB+=s.ects; else if(s.type==="TFG") c.TFG+=s.ects;
    else if(s.type===mencio) c.MEN+=s.ects; else { c.OPT+=s.ects; if(s.type==="EM") c.MINOR+=s.ects; } });
  return c;
}
const ord = n => (tv("ord")||["1r","2n","3r","4t"])[n-1];
const semLabel = n => n ? t("sem.label",{curs:ord(Math.ceil(n/2)), periode:t(n%2?"sem.tardor":"sem.primavera")}) : "";
function monogram(s){
  const skip=new Set(["d’","de","del","dels","i","la","les","l’","a","per","en","y","of","and","the"]);
  const ini=s.name.replace(/[’']/g,"’ ").split(/\s+/).filter(w=>w && !skip.has(w.toLowerCase()) && /^[A-Za-zÀ-ÿ]/.test(w)).slice(0,2).map(w=>w[0].toUpperCase()).join("");
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="6" width="52" height="52" rx="14" fill="currentColor" opacity=".12"/><rect x="6" y="6" width="52" height="52" rx="14" fill="none" stroke="currentColor" stroke-width="2"/><text x="32" y="41" text-anchor="middle" font-family="STIX Two Text, Georgia, serif" font-size="24" fill="currentColor">${ini}</text></svg>`;
}
const iconFor = s => (s.g && G[s.g]) ? svg(s.g) : monogram(s);

/* ---------- mapa del grau ---------- */
let hlId=null;
function tile(s, opts){
  const o=opts||{};
  const w=el("div","tile t-"+s.type+(passed.has(s.id)?" passed":"")+(s.id===lastToggled?" pop":"")); w.dataset.id=s.id;
  const rq=reqState(s); if(!passed.has(s.id) && !rq.ok) w.classList.add("locked");
  const a=el("a","tmain"); a.href="#"+s.id;
  a.appendChild(el("span","tname",s.name));
  const meta=el("span","tmeta"); meta.appendChild(document.createTextNode(s.ects+" ECTS"+(o.showType?" · "+typeShort(s.type):"")));
  const n=countFor(s.id); if(n){ const f=el("span","tfiles"); f.textContent=t(n===1?"n.recurs":"n.recursos",{n}); meta.appendChild(f); }
  a.appendChild(meta);
  if(!passed.has(s.id) && !rq.ok) a.title=t("tile.falta")+" "+[...rq.missing.map(id=>(byId(id)||{}).name), ...(rq.credits?[t("tile.credits",{n:rq.credits})]:[])].join(", ");
  const c=el("button","tcheck"); c.type="button"; c.setAttribute("aria-pressed",passed.has(s.id)); c.setAttribute("aria-label",(passed.has(s.id)?t("tile.desmarca"):t("tile.marca"))+" "+s.name);
  c.title=passed.has(s.id)?t("tile.aprovada"):t("tile.marcaTitle"); c.onclick=e=>{ e.preventDefault(); togglePassed(s.id); };
  w.append(a,c);
  const on=()=>highlight(s.id), off=()=>highlight(null);
  w.addEventListener("mouseenter",on); w.addEventListener("mouseleave",off); a.addEventListener("focus",on); a.addEventListener("blur",off);
  return w;
}
function highlight(id){
  hlId=id; const root=$("degree"); if(!root) return;
  root.classList.toggle("hl", !!id);
  root.querySelectorAll(".tile").forEach(x=>x.classList.remove("is-req","is-dep","is-me"));
  const wires=$("wires"); if(wires) wires.textContent="";
  if(!id) { $("hlInfo").textContent=""; return; }
  const s=byId(id); if(!s) return;
  const reqs=new Set((s.req&&s.req.ids)||[]); const deps=new Set(SUBJECTS.filter(x=>x.req&&x.req.ids&&x.req.ids.includes(id)).map(x=>x.id));
  root.querySelectorAll(".tile").forEach(x=>{ const i=x.dataset.id; if(i===id) x.classList.add("is-me"); else if(reqs.has(i)) x.classList.add("is-req"); else if(deps.has(i)) x.classList.add("is-dep"); });
  const parts=[]; if(reqs.size) parts.push(t(reqs.size>1?"hl.requisits":"hl.requisit",{n:reqs.size})); if(deps.size) parts.push(t("hl.desbloqueja",{n:deps.size}));
  $("hlInfo").textContent = s.name+(parts.length?" — "+parts.join(" · "):"");
  drawWires(id, reqs, deps);
}
function drawWires(id, reqs, deps){
  const svgEl=$("wires"), root=$("degree"); if(!svgEl||!root) return;
  const R=root.getBoundingClientRect(); svgEl.setAttribute("width",R.width); svgEl.setAttribute("height",R.height); svgEl.setAttribute("viewBox","0 0 "+R.width+" "+R.height);
  const box=i=>{ const x=root.querySelector('.tile[data-id="'+i+'"]'); if(!x) return null; const r=x.getBoundingClientRect(); return {x:r.left-R.left, y:r.top-R.top, w:r.width, h:r.height}; };
  const me=box(id); if(!me) return;
  const NS="http://www.w3.org/2000/svg";
  const link=(a,b,cls)=>{ if(!a||!b) return;
    let x1,y1,x2,y2,c1,c2;
    if(Math.abs((a.x+a.w/2)-(b.x+b.w/2))<20){ x1=a.x+a.w; y1=a.y+a.h/2; x2=b.x+b.w; y2=b.y+b.h/2; const dx=Math.min(70,20+Math.abs(y2-y1)*0.15); c1=[x1+dx,y1]; c2=[x2+dx,y2]; }
    else if(a.x+a.w/2 < b.x+b.w/2){ x1=a.x+a.w; y1=a.y+a.h/2; x2=b.x; y2=b.y+b.h/2; const m=(x1+x2)/2; c1=[m,y1]; c2=[m,y2]; }
    else { x1=a.x; y1=a.y+a.h/2; x2=b.x+b.w; y2=b.y+b.h/2; const m=(x1+x2)/2; c1=[m,y1]; c2=[m,y2]; }
    const pth=document.createElementNS(NS,"path"); pth.setAttribute("d",`M${x1},${y1} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x2},${y2}`); pth.setAttribute("class","wire "+cls); svgEl.appendChild(pth);
    const dot=document.createElementNS(NS,"circle"); dot.setAttribute("cx",x2); dot.setAttribute("cy",y2); dot.setAttribute("r",3.5); dot.setAttribute("class","wdot "+cls); svgEl.appendChild(dot); };
  reqs.forEach(r=>link(box(r),me,"req")); deps.forEach(d=>link(me,box(d),"dep"));
}

function renderDegree(){
  const c=credits(), total=c.FB+c.OB+c.MEN+Math.min(c.OPT,30)+c.TFG;
  $("bigNum").textContent=total;
  $("rState").textContent = t(total>=240?"estat.5":total>=180?"estat.4":total>=120?"estat.3":total>=60?"estat.2":total>0?"estat.1":"estat.0");
  if(total>=240 && !renderDegree.celebrated){ renderDegree.celebrated=true; if(lastToggled) burst(); } if(total<240) renderDegree.celebrated=false;
  $("bigPct").style.setProperty("--p", Math.min(100,total/240*100).toFixed(1));
  const bars=$("bars"); bars.textContent="";
  [[t("barra.FB"),c.FB,60,"FB"],[t("barra.OB"),c.OB,84,"OB"],[t("barra."+mencio),c.MEN,60,mencio],[t("barra.OT"),c.OPT,30,"OT"],[t("barra.TFG"),c.TFG,6,"TFG"]].forEach(([l,v,m,ty])=>{
    const r=el("div","brow"); r.appendChild(el("span","bl",l)); const b=el("span","bb"); const i=el("i","t-"+ty); i.style.width=Math.min(100,v/m*100)+"%"; b.appendChild(i); r.appendChild(b); r.appendChild(el("span","bv",v+"/"+m)); bars.appendChild(r); });
  $("minorMini").textContent = c.MINOR ? t("minor.mini",{n:c.MINOR}) : "";
  document.querySelectorAll("#mencio button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.m===mencio));
  const map=$("map"); map.textContent="";
  for(let y=1;y<=4;y++){
    const row=el("div","curso"); const cl=el("div","clabel"); cl.appendChild(el("span",null,ord(y)));
    row.appendChild(cl);
    [2*y-1,2*y].forEach(sem=>{
      const col=el("div","semcol"); col.appendChild(el("div","slabel", t(sem%2?"sem.Tardor":"sem.Primavera")));
      DEGREE.filter(s=>s.sem===sem && ["FB","OB","TFG",mencio].includes(s.type)).forEach(s=>col.appendChild(tile(s)));
      const optNeed = mencio==="FA" ? {5:0,6:9,7:9,8:12}[sem] : {5:0,6:12,7:6,8:12}[sem];
      if(y>=3 && optNeed){ const o=el("a","optslot"); o.href="#optativas"; o.textContent=t("opt.slot",{n:optNeed}); o.onclick=e=>{ e.preventDefault(); $("optativas").scrollIntoView({behavior:"smooth"}); }; col.appendChild(o); }
      row.appendChild(col);
    });
    map.appendChild(row);
  }
  const opt=$("optList"); opt.textContent="";
  const other = mencio==="FA"?"FF":"FA";
  const mma=MINOR.find(x=>x.id==="metodes-matematics-avancats");
  const groups=[[t("opt.comunes"), [...DEGREE.filter(s=>s.type==="OT"), ...(mma?[mma]:[])]],[t("opt.altra."+other), DEGREE.filter(s=>s.type===other)]];
  const mp=MINOR.filter(x=>passed.has(x.id)).length*6, mfiles=MINOR.reduce((a,x)=>a+countFor(x.id),0);
  const mc=el("a","mtile"); mc.href="#minor";
  const mt=el("div"); mt.appendChild(el("div","mtitle",t("minor.titol"))); mt.appendChild(el("div","msub",t("minor.sub",{n:MINOR.length,c:mp})+(mfiles?" · "+t("n.recursos",{n:mfiles}):"")));
  const mb=el("div","mbar"); const mi=el("i"); mi.style.width=Math.min(100,mp/24*100)+"%"; mb.appendChild(mi); mt.appendChild(mb);
  mc.append(mt, el("span","mgo",t("minor.entra")));
  groups.forEach(([title,list],gi)=>{ const g=el("div","ogroup"); g.appendChild(el("h3","oh",title)); const grid=el("div","ogrid"); list.sort((a,b)=>a.sem-b.sem).forEach(s=>grid.appendChild(tile(s))); if(gi===0) grid.appendChild(mc); g.appendChild(grid); opt.appendChild(g); });
  const nx=$("nextUp"); nx.textContent="";
  const avail=SUBJECTS.filter(x=>!passed.has(x.id) && ["FB","OB","TFG",mencio].includes(x.type) && reqState(x).ok).sort((a,b)=>a.sem-b.sem);
  const optAvail=SUBJECTS.filter(x=>!passed.has(x.id) && !["FB","OB","TFG",mencio].includes(x.type) && x.req && reqState(x).ok).length;
  if(!passed.size){ nx.appendChild(el("div","ntitle",t("next.comenca"))); nx.appendChild(el("p","nsub",t("next.comencaSub"))); }
  else if(!avail.length && !optAvail){ nx.appendChild(el("div","ntitle", t(total>=240?"next.complet":"next.res"))); }
  else { nx.appendChild(el("div","ntitle",t("next.potsCursar")));
    const ch=el("div","nchips"); avail.slice(0,10).forEach(x=>{ const a=el("a","nchip t-"+x.type, x.name); a.href="#"+x.id; a.onmouseenter=()=>highlight(x.id); a.onmouseleave=()=>highlight(null); ch.appendChild(a); });
    if(avail.length>10) ch.appendChild(el("span","nmore",t("next.mes",{n:avail.length-10}))); nx.appendChild(ch);
    if(optAvail) nx.appendChild(el("p","nsub",t("next.optatives",{n:optAvail}))); }
  if(hlId) highlight(hlId);
}
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("#mencio button"); if(b) setMencio(b.dataset.m); });

/* ---------- seccions de la fitxa ---------- */
// Pestanyes principals: "pla" (Pla docent) i "material" (Material d'estudi).
// Dins de Material d'estudi, cada secció és una carpeta. Les buides no es mostren.
const SECTIONS = [
  {id:"apunts", kind:"apunts"}, {id:"problemes", kind:"problemes"}, {id:"examens", kind:"examens"},
  {id:"bibliografia", kind:"biblio"}, {id:"simulacions"}, {id:"autoavaluacio"}
];
function sectionsOf(sid){
  const list=SECTIONS.map(x=>Object.assign({label:t("sec."+x.id)},x));
  extresOf(sid).forEach(e=>list.push({id:"x-"+e.id, extra:e, label:tr(e,"titol")}));
  return list;
}
function sectionCount(sid, sec){
  if(sec.kind) return resOf(sid).filter(r=>r.kind===sec.kind).length;
  if(sec.id==="simulacions") return simsOf(sid).length;
  if(sec.id==="autoavaluacio"){ const n=(RECURSOS[sid]&&RECURSOS[sid]._n_preguntes)||0; return hasQuiz(sid)?Math.max(1,n):0; }
  if(sec.extra) return sec.extra.items ? sec.extra.items.length : 1;
  return 0;
}
function sectionCountLabel(sid, sec){
  if(sec.id==="simulacions"){ const n=simsReady(sid).length, m=simsOf(sid).length-n; return [n?t(n===1?"n.simulacio":"n.simulacions",{n}):"", m?t("n.preparacio",{n:m}):""].filter(Boolean).join(" · "); }
  if(sec.id==="autoavaluacio"){ const n=(RECURSOS[sid]&&RECURSOS[sid]._n_preguntes)||0; return n?t(n===1?"n.pregunta":"n.preguntes",{n}):t("n.disponible"); }
  if(sec.extra && !sec.extra.items) return t("n.enllac");
  const n=sectionCount(sid,sec); return t(n===1?"n.fitxer":"n.fitxers",{n});
}

/* ---------- encaminament ---------- */
let tab = "";
function parseHash(){ const raw=decodeURIComponent(location.hash.slice(1)); const [sid, x] = raw.split("."); const s=SUBJECTS.find(y=>y.id===sid)||null; return { s, t: x||"" }; }
window.addEventListener("hashchange", ()=>{ const h=parseHash(); const changed = !h.s || h.s!==curSubject; renderAll(); if(changed) window.scrollTo(0,0); });
let curSubject = null;
function setTab(x){ tab=x; history.pushState(null,"","#"+curSubject.id+(x?"."+x:"")); renderDetail(); window.scrollTo(0, Math.min(window.scrollY, $("tabs").offsetTop-20)); }
window.addEventListener("popstate", ()=>renderAll());

/* ---------- minor ---------- */
function renderTally(){
  const n=[...picks].filter(id=>MINOR.some(s=>s.id===id)).length;
  const m=$("marks"); m.textContent="";
  for(let i=0;i<NEEDED;i++){ m.appendChild(el("div","mark"+(i<n?" on":""), String(i+1))); }
  $("tallyText").textContent = n===0 ? t("tally.0") : n<NEEDED ? t("tally.n",{n,c:n*6}) : n===NEEDED ? t("tally.ok") : t("tally.massa",{n});
}
function renderList(){
  const list=$("list"); list.textContent="";
  for(const s of MINOR){
    const a=el("a","subj"); a.href="#"+s.id;
    a.innerHTML=iconFor(s);
    const box=el("div"); box.appendChild(el("h2",null,s.name)); box.appendChild(el("p",null,s.sum));
    const n=countFor(s.id);
    box.appendChild(el("div","counts", n?t(n===1?"n.recurs":"n.recursos",{n}):t("minor.preparacio")));
    a.appendChild(box);
    if(picks.has(s.id)){ const pk=el("span","pick on"); pk.title=t("minor.alteu"); a.appendChild(pk); }
    list.appendChild(a);
  }
}

/* ---------- botons i elements de llista ---------- */
function linkBtn(url, label, main){
  const a=el("a","btn"+(main?" main":""), label); a.href=url; a.rel="noopener noreferrer"; a.target="_blank"; return a;
}
function itemButtons(r){
  const box=el("div","btns");
  const u=safeUrl(r.url), su=safeUrl(r.solUrl);
  if(u) box.appendChild(linkBtn(u, su?t("btn.enunciat"):t("btn.obre"), !su));
  if(su) box.appendChild(linkBtn(su, t("btn.solucio"), true));
  return box;
}
function linkify(target, text){
  String(text).split(/(https?:\/\/\S+)/).forEach(p=>{
    const u=/^https?:\/\//.test(p)?safeUrl(p):null;
    if(u){ const a=el("a",null,t("btn.enllac")); a.href=u; a.target="_blank"; a.rel="noopener noreferrer"; target.appendChild(a); }
    else target.appendChild(document.createTextNode(p));
  });
}
function itemLi(r, withTick){
  const li=el("li", withTick?"":"nochk");
  if(withTick){ const c=el("input","tick"); c.type="checkbox"; c.checked=doneRes.has(r.id); c.title=t("item.fet"); c.setAttribute("aria-label",t("item.fet")+": "+(r.title||"")); c.onchange=()=>toggleRes(r.id); li.appendChild(c); }
  const box=el("div");
  box.appendChild(el("div","t", r.title||t("item.senseTitol")));
  if(r.note){ const n=el("div","n"); linkify(n,r.note); box.appendChild(n); }
  box.appendChild(itemButtons(r));
  li.appendChild(box); li.appendChild(el("span"));
  return li;
}
const byOrder = (a,b)=>a.order-b.order;

/* ---------- cerca ---------- */
function renderHits(){
  const q=$("q").value.trim().toLowerCase(), ul=$("hits"); ul.textContent="";
  if(q.length<2){ ul.hidden=true; return; }
  const norm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const nq=norm(q), hits=[];
  for(const s of SUBJECTS){ if(norm(s.name).includes(nq)) hits.push({s, label:s.name, href:"#"+s.id, subj:true}); }
  for(const s of SUBJECTS){ temesOf(s.id).forEach((x,i)=>{ if(norm(x).includes(nq)) hits.push({s, label:t("tema.n",{n:i+1})+": "+x, href:"#"+s.id}); }); }
  for(const sim of SIMS){ if(sim.estat==="per-portar") continue; if(norm(tr(sim,"titol")+" "+tr(sim,"concepte")).includes(nq)){ const sid=(sim.assignatures||[])[0], s=byId(sid); if(s) hits.push({s, label:t("sec.simulacions")+": "+tr(sim,"titol"), href:"#"+sid+".simulacions"}); } }
  for(const sid in RECURSOS){ resOf(sid).forEach(r=>{ if(norm(r.title+" "+(r.note||"")+" "+(r.year||"")+" "+(r.conv||"")).includes(nq)){ const s=byId(sid); if(s) hits.push({s, r}); } }); }
  ul.hidden=false;
  if(!hits.length){ ul.appendChild(el("li","empty",t("cerca.res",{q}))); return; }
  hits.slice(0,40).forEach(h=>{
    const li=el("li");
    li.appendChild(el("div","sub", h.subj ? typeLabel(h.s.type)+(h.s.sem?" · "+semLabel(h.s.sem):"") : h.s.name+(h.r?" · "+t("sec."+({biblio:"bibliografia"}[h.r.kind]||h.r.kind)):"")));
    if(h.r){ li.appendChild(el("div","t",h.r.title||t("item.senseTitol"))); li.appendChild(itemButtons(h.r)); }
    else { const a=el("a",null,h.label); a.href=h.href; li.appendChild(a); }
    ul.appendChild(li);
  });
}

/* ---------- fitxa d'assignatura ---------- */
function youtubeId(u){ try{ const x=new URL(u); if(/youtu\.be$/.test(x.hostname)) return x.pathname.slice(1); if(/youtube(-nocookie)?\.com$/.test(x.hostname.replace(/^www\./,""))) return x.searchParams.get("v") || (x.pathname.match(/\/(embed|shorts)\/([\w-]+)/)||[])[2] || null; }catch(e){} return null; }
function renderVideo(s){
  const box=$("dvideo"); box.textContent=""; const v=(RECURSOS[s.id]||{}).video; const u=v&&safeUrl(v.url);
  box.hidden=!u; if(!u) return;
  const yt=youtubeId(u);
  if(yt){ const f=el("iframe"); f.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(yt); f.title=t("video.titol",{nom:s.name}); f.loading="lazy";
    f.allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"; f.allowFullscreen=true; f.referrerPolicy="strict-origin-when-cross-origin"; box.appendChild(f); }
  else box.appendChild(linkBtn(u, t("video.mira"), true));
  const cap=el("p","vcap", t("video.cap")+(v.durada?" · "+v.durada:"")+(v.autor?" · "+v.autor:"")); box.appendChild(cap);
}
let renderTok=0;
function renderDetail(){
  const s=curSubject; if(!s) return; renderTok++;
  $("detail").style.setProperty("--c","var(--c-"+s.type+")");
  $("dglyph").innerHTML=iconFor(s); $("dname").textContent=s.name; $("dsum").textContent=s.sum||""; $("dsum").hidden=!s.sum;
  const bl=$("backLink"); bl.href=s.minor?"#minor":"#"; bl.textContent=s.minor?t("back.minor"):t("back.pla");
  const df=$("dfacts"); df.textContent="";
  df.appendChild(el("span","fact t",typeLabel(s.type))); df.appendChild(el("span","fact",s.ects+" ECTS"));
  if(s.sem) df.appendChild(el("span","fact",(s.type==="OT"||s.type==="EM"?t("fact.ofereix")+" ":"")+semLabel(s.sem)));
  if(s.code) df.appendChild(el("span","fact",t("fact.codi")+" "+s.code));
  const rl=$("reqline"); rl.textContent="";
  if(s.req){ const rq=reqState(s);
    rl.appendChild(document.createTextNode(s.type==="EM"?t("req.aprovat"):t("req.cursat")));
    (s.req.ids||[]).forEach((id,k)=>{ const x=byId(id); if(!x) return; if(k) rl.appendChild(document.createTextNode(", ")); const a=el("a",null,x.name+(passed.has(id)?" ✓":"")); a.href="#"+id; rl.appendChild(a); });
    if(s.req.credits){ rl.appendChild(document.createTextNode(((s.req.ids||[]).length?t("req.i"):"")+t("req.credits",{n:s.req.credits, p:passedCredits()}))); }
    rl.appendChild(document.createTextNode(rq.ok?t("req.ok"):"."));
  }
  rl.hidden=!s.req;
  const pb=$("passBtn"); pb.setAttribute("aria-pressed",passed.has(s.id)); pb.textContent=passed.has(s.id)?t("btn.aprovada"):t("btn.marcaAprovada");
  const mb=$("mineBtn"); mb.hidden=!s.minor; mb.setAttribute("aria-pressed",picks.has(s.id)); mb.textContent=picks.has(s.id)?t("btn.alMinor"):t("btn.afegeixMinor");
  const cb=$("claudeBtn"); cb.href=CLAUDE_GUIA+"#"+s.id; cb.textContent=t("btn.claude");
  renderVideo(s);

  const tabsEl=$("tabs"); tabsEl.textContent="";
  const p=$("panel"); p.textContent="";
  const isPla = tab==="pla";
  ["material","pla"].forEach(id=>{ const b=el("button","tab",t(id==="pla"?"tab.pla":"tab.material")); b.type="button"; b.setAttribute("role","tab");
    const on = id==="pla"?isPla:!isPla; b.setAttribute("aria-selected",on); b.onclick=()=>setTab(id==="pla"?"pla":""); tabsEl.appendChild(b); });
  if(isPla){ panelPla(p,s); return; }
  const secs=sectionsOf(s.id), cur=secs.find(x=>x.id===tab);
  const crumbs=el("div","crumbs");
  if(!cur){
    const grid=el("div","folders");
    secs.forEach(x=>{ const n=sectionCount(s.id,x); const b=el("button","folder"+(n?"":" empty")); b.type="button"; b.innerHTML=FOLDER_SVG;
      b.appendChild(el("span","fname",x.label)); b.appendChild(el("span","fcount", n?sectionCountLabel(s.id,x):t("folder.buida"))); b.onclick=()=>setTab(x.id); grid.appendChild(b); });
    p.appendChild(grid);
    const n=el("p","pending"); n.appendChild(document.createTextNode(t("material.vols")+" ")); const a=el("a",null,t("material.contribueix")); a.href=CONTRIBUIR_URL; a.target="_blank"; a.rel="noopener"; n.appendChild(a); p.appendChild(n);
  } else {
    const back=el("button","link",t("material.carpetes")); back.type="button"; back.onclick=()=>setTab("");
    crumbs.append(back, el("span","sep","/"), el("span","crumb-here",cur.label)); p.appendChild(crumbs);
    const rs=resOf(s.id);
    if(!sectionCount(s.id,cur)) panelEmpty(p,s,cur);
    else if(cur.kind==="apunts") panelApunts(p,s,rs);
    else if(cur.kind==="problemes") panelProblemes(p,s,rs);
    else if(cur.kind==="examens") panelExamens(p,s,rs);
    else if(cur.kind) panelSimple(p,rs.filter(r=>r.kind===cur.kind));
    else if(cur.id==="simulacions") panelSims(p,s);
    else if(cur.id==="autoavaluacio") panelQuiz(p,s);
    else if(cur.extra) panelExtra(p,cur.extra);
  }
}

const PLANTILLA_DE = {apunts:"apunts", problemes:"apunts", examens:"apunts", bibliografia:"apunts", simulacions:"simulacio", autoavaluacio:"preguntes"};
const FITXER_DE = {apunts:"apunts.pdf", problemes:"problemes.pdf", examens:"examen.pdf", bibliografia:"llista.pdf", simulacions:"index.html", autoavaluacio:"preguntes.json"};
function panelEmpty(p, s, sec){
  const box=el("div","emptybox");
  box.appendChild(el("p",null,t("buida.text")));
  if(sec.id==="simulacions"){ const soon=simsOf(s.id).filter(x=>x.estat==="per-portar"); if(soon.length) box.appendChild(el("p","pending",t("sim.preparacio")+" "+soon.map(x=>tr(x,"titol")).join(", ")+".")); }
  box.appendChild(el("p",null,t("buida.com",{plantilla:"contingut/_plantilles/"+(PLANTILLA_DE[sec.id]||"apunts")+"/"})));
  const pre=el("pre","fitxa"); pre.textContent=["titol: …","seccio: "+sec.id,"assignatures: "+s.id,"fitxer: "+(FITXER_DE[sec.id]||"fitxer.pdf"),"autors: …","estat: esborrany"].join("\n");
  box.appendChild(pre);
  const a=el("a","btn main",t("material.contribueix")); a.href=CONTRIBUIR_URL; a.target="_blank"; a.rel="noopener"; const b=el("div","btns"); b.appendChild(a); box.appendChild(b);
  p.appendChild(box);
}
function panelPla(p, s){
  const d=(RECURSOS[s.id]||{}).docencia||{};
  const any = d.pla_docent || d.horaris || (d.professorat&&d.professorat.length);
  const box=el("div","docencia");
  if(any){
    if(d.curs) box.appendChild(el("p","dcurs",t("pla.curs",{c:d.curs})+(d.actualitzat?" · "+t("pla.actualitzat",{d:d.actualitzat}):"")));
    const btns=el("div","btns");
    const pd=safeUrl(d.pla_docent), ho=safeUrl(d.horaris);
    if(pd) btns.appendChild(linkBtn(pd,t("pla.plaDocent"),true));
    if(ho) btns.appendChild(linkBtn(ho,t("pla.horaris"),false));
    if(btns.childNodes.length) box.appendChild(btns);
    if(d.professorat&&d.professorat.length){ box.appendChild(el("h3","dh",t("pla.professorat"))); const ul=el("ul","prof");
      d.professorat.forEach(x=>{ const li=el("li"); const u=safeUrl(x.url); if(u){ const a=el("a",null,x.nom); a.href=u; a.target="_blank"; a.rel="noopener"; li.appendChild(a); } else li.appendChild(document.createTextNode(x.nom||"")); if(x.grup) li.appendChild(el("span","pg"," · "+x.grup)); ul.appendChild(li); });
      box.appendChild(ul); }
  } else box.appendChild(el("p","empty",t("pla.buit")));
  const extra=resOf(s.id).filter(r=>r.kind==="pla"); if(extra.length){ const ul=el("ul","items"); extra.sort(byOrder).forEach(r=>ul.appendChild(itemLi(r,false))); box.appendChild(ul); }
  const off=el("p","official"); off.appendChild(document.createTextNode(t("pla.oficial")+" ")); const a=el("a",null,t("pla.guia")); a.href=GUIA_ACADEMICA; a.target="_blank"; a.rel="noopener"; off.appendChild(a); box.appendChild(off);
  p.appendChild(box);
}
function panelApunts(p, s, rs){
  const ap=rs.filter(r=>r.kind==="apunts").sort(byOrder), tm=temesOf(s.id);
  const hasT=r=>r.tema!==null&&r.tema!==""&&r.tema!==undefined&&Number(r.tema)<tm.length;
  const gen=ap.filter(r=>!hasT(r));
  if(gen.length){ if(tm.length) p.appendChild(el("div","group",t("tema.totCurs"))); const ul=el("ul","items"); gen.forEach(r=>ul.appendChild(itemLi(r,false))); p.appendChild(ul); }
  tm.forEach((x,k)=>{ const g=ap.filter(r=>hasT(r)&&Number(r.tema)===k); if(!g.length) return;
    const h=el("div","group"); h.appendChild(el("span",null,String(k+1))); h.appendChild(document.createTextNode(x)); p.appendChild(h);
    const ul=el("ul","items"); g.forEach(r=>ul.appendChild(itemLi(r,false))); p.appendChild(ul); });
}
function panelProblemes(p, s, rs){
  const pb=rs.filter(r=>r.kind==="problemes").sort(byOrder), tm=temesOf(s.id);
  const done=pb.filter(r=>doneRes.has(r.id)).length;
  const pr=el("div","prog"); const bar=el("div","bar"); const i=el("i"); i.style.width=(100*done/pb.length)+"%"; bar.appendChild(i);
  pr.appendChild(bar); pr.appendChild(el("span",null,t("prob.fetes",{n:done,m:pb.length}))); p.appendChild(pr);
  const groups=new Map();
  pb.forEach(r=>{ const k=(r.tema!==null&&r.tema!==""&&r.tema!==undefined&&Number(r.tema)<tm.length)?Number(r.tema):-1; if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(r); });
  [...groups.keys()].sort((a,b)=>(a<0?999:a)-(b<0?999:b)).forEach(k=>{
    const h=el("div","group"); if(k>=0){ h.appendChild(el("span",null,String(k+1))); h.appendChild(document.createTextNode(tm[k])); } else h.textContent=t("prob.generals"); p.appendChild(h);
    const ul=el("ul","items"); groups.get(k).forEach(r=>ul.appendChild(itemLi(r,true))); p.appendChild(ul);
  });
}
function panelExamens(p, s, rs){
  const ex=rs.filter(r=>r.kind==="examens").sort((a,b)=>String(b.year||"").localeCompare(String(a.year||"")) || byOrder(a,b));
  const wrap=el("div","tbl"), tb0=el("table"), th=el("thead"), hr=el("tr");
  [t("ex.curs"),t("ex.conv"),t("ex.examen")].forEach(x=>hr.appendChild(el("th",null,x))); th.appendChild(hr); tb0.appendChild(th);
  const tb=el("tbody");
  ex.forEach(r=>{
    const tr0=el("tr");
    tr0.appendChild(el("td","y",r.year||"—"));
    const cv=el("td"); cv.appendChild(el("div",null,r.conv||r.title||"")); if(r.note){ const n=el("div","n"); linkify(n,r.note); cv.appendChild(n);} tr0.appendChild(cv);
    const bt=el("td"); bt.appendChild(itemButtons(r)); tr0.appendChild(bt);
    tb.appendChild(tr0);
  });
  tb0.appendChild(tb); wrap.appendChild(tb0); p.appendChild(wrap);
}
function panelSimple(p, items){ const ul=el("ul","items"); items.sort(byOrder).forEach(r=>ul.appendChild(itemLi(r,false))); p.appendChild(ul); }

function badge(estat){ const b=el("span","badge b-"+estat, t("estat."+estat)); return b; }
function panelSims(p, s){
  const list=simsReady(s.id);
  const grid=el("div","sims");
  list.forEach(sim=>{
    const c=el("article","sim"); c.id="sim-"+sim.id;
    const h=el("div","simh"); h.appendChild(el("h3",null,tr(sim,"titol"))); h.appendChild(badge(sim.estat||"esborrany")); c.appendChild(h);
    if(tr(sim,"concepte")) c.appendChild(el("p","simc",tr(sim,"concepte")));
    const meta=[]; if(sim.tipus) meta.push(t("simtipus."+sim.tipus)); if(sim.autors&&sim.autors.length) meta.push(sim.autors.join(", "));
    const others=(sim.assignatures||[]).filter(x=>x!==s.id).map(byId).filter(Boolean);
    if(meta.length) c.appendChild(el("p","simm",meta.join(" · ")));
    if(others.length){ const o=el("p","simm"); o.appendChild(document.createTextNode(t("sim.tambe")+" ")); others.forEach((x,k)=>{ if(k) o.appendChild(document.createTextNode(", ")); const a=el("a",null,x.name); a.href="#"+x.id+".simulacions"; o.appendChild(a); }); c.appendChild(o); }
    const file = (LANG!=="ca" && sim["fitxer_"+LANG]) || sim.fitxer;
    const btns=el("div","btns");
    const show=el("button","btn main",t("sim.mostra")); show.type="button";
    const frameBox=el("div","simframe"); frameBox.hidden=true;
    show.onclick=()=>{ if(frameBox.hidden){ if(!frameBox.firstChild){ const f=el("iframe"); f.src=file; f.title=tr(sim,"titol"); f.loading="lazy"; frameBox.appendChild(f); } frameBox.hidden=false; show.textContent=t("sim.amaga"); } else { frameBox.hidden=true; show.textContent=t("sim.mostra"); } };
    btns.appendChild(show); btns.appendChild(linkBtn(file,t("sim.pantalla"),false));
    c.appendChild(btns); c.appendChild(frameBox); grid.appendChild(c);
  });
  p.appendChild(grid);
  const soon=simsOf(s.id).filter(x=>x.estat==="per-portar");
  if(soon.length) p.appendChild(el("p","pending",t("sim.preparacio")+" "+soon.map(x=>tr(x,"titol")).join(", ")+"."));
}
async function panelQuiz(p, s){
  const info=quizInfo(s.id);
  const apps=quizApps(s.id).map(x=>({u:safeUrl(x.url), titol:x.titol})).filter(x=>x.u);
  if(apps.length){ const b=el("div","btns quizapp"); apps.forEach((x,i)=>b.appendChild(linkBtn(x.u, x.titol||t("quiz.app"), i===0))); p.appendChild(b); }
  if(!info.preguntes) return;
  const tok=renderTok;
  await ensureQuiz(s.id);
  if(tok!==renderTok) return;
  const Q=QUIZ[s.id];
  if(Q.estat==="error"){ p.appendChild(el("p","empty",t("quiz.error"))); return; }
  const qs=Q.preguntes; if(!qs.length){ p.appendChild(el("p","empty",t("quiz.buit"))); return; }
  let right=0, answered=0;
  const score=el("p","qscore"); const upd=()=>{ score.textContent=t("quiz.punts",{n:right,a:answered,m:qs.length}); }; upd(); p.appendChild(score);
  const ol=el("ol","quiz");
  qs.forEach((q,qi)=>{
    const li=el("li","q");
    const head=el("div","qh"); head.appendChild(el("p","qe",tr(q,"enunciat"))); if(q.estat && q.estat!=="revisat") head.appendChild(badge(q.estat)); li.appendChild(head);
    const opts=el("div","qo"); const exp=el("div","qx"); exp.hidden=true;
    const opcions=(LANG!=="ca"&&q["opcions_"+LANG])||q.opcions||[];
    opcions.forEach((o,oi)=>{ const b=el("button","qopt",o); b.type="button";
      b.onclick=()=>{ if(li.dataset.done) return; li.dataset.done="1"; answered++; const ok=oi===q.correcta; if(ok) right++;
        opts.querySelectorAll("button").forEach((x,xi)=>{ x.disabled=true; if(xi===q.correcta) x.classList.add("ok"); else if(xi===oi) x.classList.add("ko"); });
        exp.hidden=false; exp.prepend(el("strong",null,t(ok?"quiz.be":"quiz.malament")+" ")); upd(); };
      opts.appendChild(b); });
    li.appendChild(opts);
    exp.appendChild(document.createTextNode(tr(q,"explicacio")));
    const sim=q.simulacio && SIMS.find(x=>x.id===q.simulacio && x.estat!=="per-portar");
    if(sim){ const a=el("a","qsim",t("quiz.simulacio",{nom:tr(sim,"titol")})); a.href="#"+s.id+".simulacions"; exp.appendChild(document.createElement("br")); exp.appendChild(a); }
    li.appendChild(exp); ol.appendChild(li);
  });
  p.appendChild(ol);
  const again=el("button","link",t("quiz.reinicia")); again.type="button"; again.onclick=()=>renderDetail(); p.appendChild(again);
}
function panelExtra(p, e){
  if(tr(e,"descripcio")) p.appendChild(el("p","xdesc",tr(e,"descripcio")));
  const u=safeUrl(e.url);
  if(u){ const b=el("div","btns"); const a=el("a","btn main",t("extra.obre")); a.href=u; if(/^https?:/.test(e.url)){ a.target="_blank"; a.rel="noopener"; } b.appendChild(a); p.appendChild(b); }
  if(e.items&&e.items.length){ const ul=el("ul","items"); e.items.forEach((x,i)=>ul.appendChild(itemLi({id:"x:"+e.id+":"+i,title:tr(x,"titol"),url:x.url||"",solUrl:x.solucio||"",note:tr(x,"nota")},false))); p.appendChild(ul); }
}

/* ---------- pintar-ho tot ---------- */
const NAV_SUBJECT = {navPractiques:"practiques-empresa", navTfg:"tfg"};
async function renderAll(){
  const h=parseHash(); curSubject=h.s; tab=h.t;
  const page = curSubject ? "detail" : (location.hash==="#minor" ? "minor" : "home");
  $("home").hidden=page!=="home"; $("heroHome").hidden=page!=="home"; $("minorSec").hidden=page!=="minor"; $("detail").hidden=page!=="detail";
  const setCur=(n,on)=>{ if(!n) return; on?n.setAttribute("aria-current","page"):n.removeAttribute("aria-current"); };
  const special = curSubject && Object.values(NAV_SUBJECT).includes(curSubject.id);
  setCur($("navPlan"), page==="home" || (page==="detail"&&!curSubject.minor&&!special));
  setCur($("navMinor"), page==="minor" || (page==="detail"&&curSubject.minor));
  for(const k in NAV_SUBJECT) setCur($(k), page==="detail" && curSubject.id===NAV_SUBJECT[k]);
  document.title = curSubject ? curSubject.name+" · ℏbar" : page==="minor" ? t("minor.titol")+" · ℏbar" : "ℏbar · Física UB";
  if(page==="detail"){ const s=curSubject; if(!recursosBundle && !(s.id in RECURSOS)){ await ensureRecursos(s.id); if(curSubject!==s) return; } renderDetail(); }
  else if(page==="minor"){ renderTally(); renderList(); } else { renderDegree(); renderHits(); }
}

$("mineBtn").onclick=()=>{ if(curSubject) togglePick(curSubject.id); };
$("passBtn").onclick=()=>{ if(curSubject) togglePassed(curSubject.id); };
$("q").addEventListener("input", renderHits);

/* ---------- ones del capçal: interferència de dues fonts ---------- */
(function(){
  const cv=$("waves"); if(!cv||!cv.getContext) return;
  const ctx=cv.getContext("2d"), hero=$("heroHome");
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W=0,H=0,dpr=1, mx=null, my=null, sx=0, sy=0, tt=0, raf=0, visible=true;
  function size(){ const r=hero.getBoundingClientRect(); dpr=Math.min(devicePixelRatio||1,2); W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+"px"; cv.style.height=H+"px"; ctx.setTransform(dpr,0,0,dpr,0,0); if(mx===null){ sx=W*0.62; sy=H*0.35; } draw(); }
  function draw(){
    if(!W) return; ctx.clearRect(0,0,W,H);
    const col=getComputedStyle(document.documentElement).getPropertyValue("--blue").trim()||"#2340A8";
    const step=W<600?11:9, k=0.045, s1x=W*0.93, s1y=H*0.72;
    if(mx!==null){ sx+=(mx-sx)*0.08; sy+=(my-sy)*0.08; }
    ctx.fillStyle=col;
    for(let y=step/2;y<H;y+=step) for(let x=step/2;x<W;x+=step){
      const r1=Math.hypot(x-s1x,y-s1y), r2=Math.hypot(x-sx,y-sy);
      const a=Math.cos(k*r1-tt)/(1+r1*0.0015)+Math.cos(k*r2-tt)/(1+r2*0.0015);
      const v=a*a/4; if(v<0.06) continue;
      ctx.globalAlpha=Math.min(.7,.12+v*.75); ctx.beginPath(); ctx.arc(x,y,.8+v*2.2,0,6.283); ctx.fill();
    }
    ctx.globalAlpha=1;
    [[s1x,s1y],[sx,sy]].forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x,y,3.5,0,6.283); ctx.fill(); });
  }
  function loop(){ if(!visible||document.hidden||hero.hidden){ raf=0; return; } tt+=0.06; draw(); raf=requestAnimationFrame(loop); }
  function start(){ if(!reduce && !raf) raf=requestAnimationFrame(loop); }
  hero.addEventListener("pointermove",e=>{ const r=hero.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; start(); });
  if("IntersectionObserver" in window) new IntersectionObserver(es=>{ visible=es[0].isIntersecting; if(visible) start(); }).observe(hero);
  document.addEventListener("visibilitychange",()=>{ if(!document.hidden) start(); });
  window.addEventListener("hashchange",()=>setTimeout(()=>{ if(!hero.hidden){ size(); start(); } },30));
  window.addEventListener("resize",size); setTimeout(()=>{ size(); start(); },50);
})();
function burst(){
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const syms=["ψ","ℏ","∇","∫","Σ","∂","λ","Ω","∞","π"], cols=["--c-FB","--c-FF","--c-FA","--c-OT","--c-EM"];
  const layer=el("div","burst"); document.body.appendChild(layer);
  for(let i=0;i<34;i++){ const sp=el("span",null,syms[i%syms.length]); const ang=Math.random()*Math.PI*2, d=140+Math.random()*260;
    sp.style.setProperty("--dx",(Math.cos(ang)*d).toFixed(0)+"px"); sp.style.setProperty("--dy",(Math.sin(ang)*d-120).toFixed(0)+"px");
    sp.style.setProperty("--r",(Math.random()*720-360).toFixed(0)+"deg"); sp.style.color="var("+cols[i%cols.length]+")"; sp.style.animationDelay=(Math.random()*120)+"ms"; layer.appendChild(sp); }
  setTimeout(()=>layer.remove(),1800);
}

/* ---------- arrencada ---------- */
(async function boot(){
  try{
    const [ca, cur, subj, sims] = await Promise.all([
      getJSON("data/i18n/ca.json"),
      LANG==="ca" ? Promise.resolve(null) : getJSON("data/i18n/"+LANG+".json").catch(()=>({})),
      getJSON("data/assignatures.json"),
      getJSON("data/simulacions.json").catch(()=>[])
    ]);
    DICT_CA=ca; DICT=cur||ca;
    SUBJECTS=subj.filter(o=>(o.pla||"actual")===PLA).map(adapt);
    DEGREE=SUBJECTS.filter(s=>!s.minor); MINOR=SUBJECTS.filter(s=>s.minor);
    SIMS=Array.isArray(sims)?sims:[];
    try{ RECURSOS=await getJSON("data/recursos.json"); recursosBundle=true; }catch(e){ RECURSOS={}; recursosBundle=false; }
  }catch(e){
    console.error(e);
    const m=$("loadError"); if(m) m.hidden=false;
    return;
  }
  applyStatic();
  document.body.classList.add("ready");
  renderAll();
})();

})();
