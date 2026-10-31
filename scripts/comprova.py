#!/usr/bin/env python3
"""Comprova que les dades de la web són correctes i, amb --construeix, prepara la carpeta _site/.

Ús:
    python3 scripts/comprova.py               # només comprova
    python3 scripts/comprova.py --construeix  # comprova i construeix _site/

GitHub l'executa automàticament a cada proposta (pull request) i abans de publicar.
Si hi ha errors, la proposta queda marcada en vermell i explica què cal corregir.
"""
import json
import shutil
import sys
from pathlib import Path

ARREL = Path(__file__).resolve().parent.parent
TIPUS = {"FB", "OB", "FA", "FF", "OT", "EM", "TFG"}
ESTATS_SIM = {"per-portar", "esborrany", "revisat"}
TIPUS_SIM = {"simulacio", "objecte-visual"}
ESTATS_PREG = {"esborrany", "revisat"}
MATERIAL = {"apunts", "problemes", "examens", "bibliografia", "pla"}
A_PUBLICAR = ["index.html", "assets", "data", "simulacions", "autoavaluacio", "guies"]

errors, avisos = [], []
def err(lloc, msg): errors.append(f"{lloc}: {msg}")
def avis(lloc, msg): avisos.append(f"{lloc}: {msg}")

def llegeix(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        err(path.relative_to(ARREL), f"JSON mal format (línia {e.lineno}, columna {e.colno}): {e.msg}")
    except FileNotFoundError:
        err(path.relative_to(ARREL), "no existeix")
    return None

def comprova_url(lloc, u, obligatori=False):
    if not u:
        if obligatori: err(lloc, "falta l'enllaç")
        return
    if u.startswith(("https://", "http://")):
        return
    if u.startswith(("/", "javascript:", "data:")):
        err(lloc, f"enllaç no vàlid: {u}")
        return
    if not (ARREL / u.split("#")[0]).exists():
        err(lloc, f"el fitxer o la carpeta «{u}» no existeix al repositori")

def main():
    construeix = "--construeix" in sys.argv

    # --- assignatures ---
    subj = llegeix(ARREL / "data/assignatures.json") or []
    ids = set()
    for i, s in enumerate(subj):
        lloc = f"data/assignatures.json [{i}] {s.get('id', '?')}"
        for camp in ("id", "nom", "ects", "tipus"):
            if camp not in s: err(lloc, f"falta el camp «{camp}»")
        if s.get("id") in ids: err(lloc, "id repetit")
        ids.add(s.get("id"))
        if s.get("tipus") not in TIPUS: err(lloc, f"tipus «{s.get('tipus')}» desconegut (vàlids: {', '.join(sorted(TIPUS))})")
    for s in subj:
        for r in (s.get("requisits") or {}).get("assignatures", []):
            if r not in ids: err(f"data/assignatures.json {s.get('id')}", f"el requisit «{r}» no és cap assignatura")

    # --- simulacions ---
    sims = llegeix(ARREL / "data/simulacions.json") or []
    sim_ids = set()
    for i, s in enumerate(sims):
        lloc = f"data/simulacions.json {s.get('id', f'[{i}]')}"
        for camp in ("id", "titol", "assignatures", "estat"):
            if camp not in s: err(lloc, f"falta el camp «{camp}»")
        if s.get("id") in sim_ids: err(lloc, "id repetit")
        sim_ids.add(s.get("id"))
        if s.get("estat") not in ESTATS_SIM: err(lloc, f"estat «{s.get('estat')}» no vàlid ({', '.join(sorted(ESTATS_SIM))})")
        if s.get("tipus", "simulacio") not in TIPUS_SIM: err(lloc, f"tipus «{s.get('tipus')}» no vàlid ({', '.join(sorted(TIPUS_SIM))})")
        for a in s.get("assignatures", []):
            if a not in ids: err(lloc, f"l'assignatura «{a}» no existeix a data/assignatures.json")
        if s.get("estat") != "per-portar":
            comprova_url(lloc, s.get("fitxer"), obligatori=True)
        if s.get("estat") == "revisat" and not s.get("revisor"):
            err(lloc, "una simulació «revisat» ha d'indicar qui l'ha revisada (camp «revisor»)")

    # --- preguntes d'autoavaluació ---
    n_preguntes = {}
    for f in sorted((ARREL / "autoavaluacio").glob("*.json")):
        if f.name.startswith("_"): continue
        d = llegeix(f)
        if not d: continue
        lloc = f"autoavaluacio/{f.name}"
        a = d.get("assignatura")
        if a not in ids: err(lloc, f"l'assignatura «{a}» no existeix")
        if f.stem != a: err(lloc, f"el nom del fitxer ha de ser «{a}.json»")
        pids = set()
        for j, q in enumerate(d.get("preguntes", [])):
            ql = f"{lloc} pregunta {q.get('id', j + 1)}"
            if q.get("id") in pids: err(ql, "id repetit")
            pids.add(q.get("id"))
            ops = q.get("opcions") or []
            if not q.get("enunciat"): err(ql, "falta l'enunciat")
            if len(ops) < 2: err(ql, "calen almenys dues opcions")
            if not isinstance(q.get("correcta"), int) or not 0 <= q["correcta"] < len(ops):
                err(ql, "«correcta» ha de ser la posició d'una opció (començant per 0)")
            if not q.get("explicacio"): err(ql, "falta l'explicació")
            if q.get("simulacio") and q["simulacio"] not in sim_ids: err(ql, f"la simulació «{q['simulacio']}» no existeix")
            if q.get("estat", "esborrany") not in ESTATS_PREG: err(ql, f"estat «{q.get('estat')}» no vàlid")
        n_preguntes[a] = len(d.get("preguntes", []))

    # --- recursos per assignatura ---
    recursos = {}
    for f in sorted((ARREL / "data/recursos").glob("*.json")):
        if f.name.startswith("_"): continue
        d = llegeix(f)
        if not d: continue
        lloc = f"data/recursos/{f.name}"
        a = d.get("assignatura")
        if a not in ids: err(lloc, f"l'assignatura «{a}» no existeix")
        if f.stem != a: err(lloc, f"el nom del fitxer ha de ser «{a}.json»")
        comprova_url(f"{lloc} vídeo", (d.get("video") or {}).get("url"))
        doc = d.get("docencia") or {}
        comprova_url(f"{lloc} pla docent", doc.get("pla_docent"))
        comprova_url(f"{lloc} horaris", doc.get("horaris"))
        for k, items in (d.get("material") or {}).items():
            if k not in MATERIAL: err(lloc, f"secció de material «{k}» desconeguda ({', '.join(sorted(MATERIAL))})"); continue
            for j, x in enumerate(items or []):
                comprova_url(f"{lloc} {k}[{j}]", x.get("url"), obligatori=(k != "bibliografia"))
                comprova_url(f"{lloc} {k}[{j}] solució", x.get("solucio"))
        auto = d.get("autoavaluacio") or {}
        comprova_url(f"{lloc} app", auto.get("app"))
        if auto.get("preguntes"): comprova_url(f"{lloc} preguntes", auto["preguntes"])
        for j, e in enumerate(d.get("extres") or []):
            if not e.get("id") or not e.get("titol"): err(f"{lloc} extres[{j}]", "cada extra necessita «id» i «titol»")
            comprova_url(f"{lloc} extres[{j}]", e.get("url"))
        if a in n_preguntes: d["_n_preguntes"] = n_preguntes[a]
        recursos[a] = d

    # --- idiomes ---
    ca = llegeix(ARREL / "data/i18n/ca.json") or {}
    for lang in ("es", "en"):
        d = llegeix(ARREL / f"data/i18n/{lang}.json") or {}
        sobren = [k for k in d if k not in ca]
        if sobren: avis(f"data/i18n/{lang}.json", "claus que no existeixen en català: " + ", ".join(sobren))
        falten = [k for k in ca if k not in d and not k.startswith("_")]
        if falten: avis(f"data/i18n/{lang}.json", f"{len(falten)} textos sense traduir (es mostraran en català)")

    for a in avisos: print("AVÍS  ", a)
    for e in errors: print("ERROR ", e)
    if errors:
        print(f"\n{len(errors)} error(s). Corregeix-los i torna-ho a provar.")
        sys.exit(1)
    print(f"Tot correcte: {len(subj)} assignatures, {len(sims)} simulacions, {len(recursos)} fitxers de recursos, {sum(n_preguntes.values())} preguntes.")

    if construeix:
        sortida = ARREL / "_site"
        if sortida.exists(): shutil.rmtree(sortida)
        sortida.mkdir()
        for nom in A_PUBLICAR:
            src = ARREL / nom
            if src.is_dir(): shutil.copytree(src, sortida / nom, ignore=shutil.ignore_patterns("_plantilla*", "_exemple*"))
            elif src.exists(): shutil.copy2(src, sortida / nom)
        (sortida / "data/recursos.json").write_text(json.dumps(recursos, ensure_ascii=False), encoding="utf-8")
        (sortida / ".nojekyll").write_text("")
        print(f"Web construïda a {sortida.relative_to(ARREL)}/")

if __name__ == "__main__":
    main()
