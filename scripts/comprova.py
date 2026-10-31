#!/usr/bin/env python3
"""Comprova el contingut de la web i, amb --construeix, prepara la carpeta _site/.

Ús (des de la carpeta del repositori):
    py scripts/comprova.py                # Windows: només comprova
    py scripts/comprova.py --construeix   # comprova i construeix _site/
    (a Mac o Linux, python3 en lloc de py)

Com funciona:
- Cada aportació és una carpeta dins de contingut/ amb un fitxer fitxa.yml.
- La fitxa diu a quines assignatures va (assignatures:) i a quina secció (seccio:).
- Aquest script llegeix totes les fitxes i col·loca cada aportació al seu lloc de la web.

GitHub l'executa a cada proposta i abans de publicar. Si hi ha errors, explica què cal corregir.
"""
import json
import re
import shutil
import sys
from pathlib import Path

ARREL = Path(__file__).resolve().parent.parent
CONTINGUT = ARREL / "contingut"
TIPUS_ASSIG = {"FB", "OB", "FA", "FF", "OT", "EM", "TFG"}
SECCIONS = {"apunts", "problemes", "examens", "bibliografia", "simulacions", "autoavaluacio", "video", "extra"}
MATERIAL = {"apunts", "problemes", "examens", "bibliografia"}
ESTATS = {"per-portar", "esborrany", "revisat"}
TIPUS_SIM = {"simulacio", "objecte-visual"}
LLISTES = {"assignatures", "autors"}
A_PUBLICAR = ["index.html", "assets", "data", "guies", "contingut"]

errors, avisos = [], []
def err(lloc, msg): errors.append(f"{lloc}: {msg}")
def avis(lloc, msg): avisos.append(f"{lloc}: {msg}")
def rel(p): return p.relative_to(ARREL).as_posix()

def llegeix_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        err(rel(path), f"JSON mal format (línia {e.lineno}, columna {e.colno}): {e.msg}")
    except FileNotFoundError:
        err(rel(path), "no existeix")
    return None

def llegeix_fitxa(path):
    """Format senzill: una línia per camp, «clau: valor». # inicia un comentari."""
    d = {}
    for n, linia in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        linia = re.sub(r"(^|\s)#.*$", "", linia).strip()
        if not linia:
            continue
        clau, sep, valor = linia.partition(":")
        if not sep:
            err(f"{rel(path)} línia {n}", "cada línia ha de ser «camp: valor»")
            continue
        clau, valor = clau.strip().lower(), valor.strip().strip('"').strip("'")
        if clau in d:
            err(f"{rel(path)} línia {n}", f"el camp «{clau}» està repetit")
        d[clau] = [x.strip() for x in valor.split(",") if x.strip()] if clau in LLISTES else valor
    return d

def es_url(u): return u.startswith(("https://", "http://"))

def comprova_url(lloc, u):
    if u and not es_url(u):
        err(lloc, f"«{u}» ha de ser un enllaç complet (que comenci per https://)")

def comprova_preguntes(lloc, dades, sim_ids):
    qs = dades.get("preguntes") if isinstance(dades, dict) else None
    if not isinstance(qs, list) or not qs:
        err(lloc, "no hi ha cap pregunta (cal una llista «preguntes»)")
        return []
    vistos = set()
    for j, q in enumerate(qs):
        ql = f"{lloc} pregunta {q.get('id', j + 1)}"
        if q.get("id") in vistos: err(ql, "id repetit")
        vistos.add(q.get("id"))
        ops = q.get("opcions") or []
        if not q.get("enunciat"): err(ql, "falta l'enunciat")
        if len(ops) < 2: err(ql, "calen almenys dues opcions")
        if not isinstance(q.get("correcta"), int) or not 0 <= q["correcta"] < len(ops):
            err(ql, "«correcta» ha de ser la posició d'una opció, començant per 0")
        if not q.get("explicacio"): err(ql, "falta l'explicació")
        if q.get("simulacio") and q["simulacio"] not in sim_ids:
            err(ql, f"la simulació «{q['simulacio']}» no existeix a contingut/")
    return qs

def main():
    construeix = "--construeix" in sys.argv

    # --- assignatures ---
    subj = llegeix_json(ARREL / "data/assignatures.json") or []
    ids = set()
    for i, s in enumerate(subj):
        lloc = f"data/assignatures.json {s.get('id', f'[{i}]')}"
        for camp in ("id", "nom", "ects", "tipus"):
            if camp not in s: err(lloc, f"falta el camp «{camp}»")
        if s.get("id") in ids: err(lloc, "id repetit")
        ids.add(s.get("id"))
        if s.get("tipus") not in TIPUS_ASSIG: err(lloc, f"tipus «{s.get('tipus')}» desconegut")
    for s in subj:
        for r in (s.get("requisits") or {}).get("assignatures", []):
            if r not in ids: err(f"data/assignatures.json {s.get('id')}", f"el requisit «{r}» no és cap assignatura")

    # --- recursos fixos per assignatura (coordinació: docència, temes, extres generals) ---
    recursos = {}
    for f in sorted((ARREL / "data/recursos").glob("*.json")):
        if f.name.startswith("_"): continue
        d = llegeix_json(f)
        if not d: continue
        a = d.get("assignatura")
        if a not in ids: err(rel(f), f"l'assignatura «{a}» no existeix")
        if f.stem != a: err(rel(f), f"el nom del fitxer ha de ser «{a}.json»")
        recursos[a] = d

    # --- contingut/: cada carpeta amb fitxa.yml és una aportació ---
    fitxes = []
    if CONTINGUT.exists():
        for carpeta in sorted(p for p in CONTINGUT.iterdir() if p.is_dir() and not p.name.startswith(("_", "."))):
            fitxa = carpeta / "fitxa.yml"
            lloc = rel(carpeta)
            if not fitxa.exists():
                err(lloc, "falta el fitxer fitxa.yml (copia'n un de contingut/_plantilles/)")
                continue
            if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", carpeta.name):
                err(lloc, "el nom de la carpeta ha de ser en minúscules, sense accents ni espais, amb guions (p. ex. stern-gerlach)")
            d = llegeix_fitxa(fitxa)
            d["_id"], d["_dir"], d["_lloc"] = carpeta.name, carpeta, f"{lloc}/fitxa.yml"
            fitxes.append(d)

    sim_ids = {d["_id"] for d in fitxes if d.get("seccio") == "simulacions"}
    sims, preguntes = [], {}

    def rec(a):
        return recursos.setdefault(a, {"assignatura": a})

    for d in fitxes:
        lloc, sec, estat = d["_lloc"], d.get("seccio"), d.get("estat", "esborrany")
        assig = d.get("assignatures") or []
        if not d.get("titol"): err(lloc, "falta «titol»")
        if not assig: err(lloc, "falta «assignatures» (els ids de data/assignatures.json, separats per comes)")
        for a in assig:
            if a not in ids: err(lloc, f"l'assignatura «{a}» no existeix a data/assignatures.json")
        if sec not in SECCIONS:
            err(lloc, f"«seccio: {sec or ''}» no és vàlida. Opcions: {', '.join(sorted(SECCIONS))}")
            continue
        if estat not in ESTATS: err(lloc, f"«estat: {estat}» no és vàlid. Opcions: {', '.join(sorted(ESTATS))}")
        if estat == "revisat" and not d.get("revisor"): err(lloc, "si l'estat és «revisat», cal indicar «revisor»")
        fitxer, enllac = d.get("fitxer", ""), d.get("enllac", "")
        comprova_url(lloc, enllac)
        if fitxer and not (d["_dir"] / fitxer).is_file():
            err(lloc, f"el fitxer «{fitxer}» no és dins de la carpeta {rel(d['_dir'])}/")
        if estat != "per-portar" and not fitxer and not enllac:
            err(lloc, "cal «fitxer» (un fitxer de la carpeta) o «enllac» (un enllaç)")
        if fitxer and enllac:
            avis(lloc, "hi ha «fitxer» i «enllac»; es farà servir el fitxer")
        url = f"contingut/{d['_id']}/{fitxer}" if fitxer else enllac
        sol = d.get("solucio", "")
        if sol and not es_url(sol):
            if not (d["_dir"] / sol).is_file(): err(lloc, f"la solució «{sol}» no és dins de la carpeta")
            sol = f"contingut/{d['_id']}/{sol}"
        assig = [a for a in assig if a in ids]
        trad = {k: v for k, v in d.items() if re.fullmatch(r"(titol|concepte|nota)_(es|en)", k)}

        if sec == "simulacions":
            tipus = d.get("tipus", "simulacio")
            if tipus not in TIPUS_SIM: err(lloc, f"«tipus: {tipus}» no és vàlid ({', '.join(sorted(TIPUS_SIM))})")
            sims.append({"id": d["_id"], "titol": d.get("titol", ""), "tipus": tipus, "autors": d.get("autors", []),
                         "assignatures": assig, "concepte": d.get("concepte", ""),
                         "fitxer": url if estat != "per-portar" else "",
                         "estat": estat, "revisor": d.get("revisor", ""), **trad})
        elif estat == "per-portar":
            continue
        elif sec in MATERIAL:
            item = {"titol": d.get("titol", ""), "url": url, "solucio": sol, "autor": ", ".join(d.get("autors", [])),
                    "nota": d.get("nota", ""), "curs": d.get("curs", ""), "convocatoria": d.get("convocatoria", ""), **trad}
            if d.get("tema"):
                if d["tema"].isdigit() and int(d["tema"]) >= 1: item["tema"] = int(d["tema"]) - 1
                else: err(lloc, "«tema» ha de ser un número (1, 2, 3…)")
            for a in assig: rec(a).setdefault("material", {}).setdefault(sec, []).append(item)
        elif sec == "video":
            for a in assig:
                if (rec(a).get("video") or {}).get("url"): avis(lloc, f"«{a}» ja tenia vídeo; es manté el primer")
                else: rec(a)["video"] = {"url": url, "durada": d.get("durada", ""), "autor": ", ".join(d.get("autors", []))}
        elif sec == "autoavaluacio":
            for a in assig:
                au = rec(a).setdefault("autoavaluacio", {})
                if fitxer:
                    qs = comprova_preguntes(f"{rel(d['_dir'])}/{fitxer}", llegeix_json(d["_dir"] / fitxer) or {}, sim_ids)
                    for q in qs: preguntes.setdefault(a, []).append({**q, "estat": q.get("estat", estat)})
                else:
                    au.setdefault("apps", []).append({"titol": d.get("titol", ""), "url": enllac})
        elif sec == "extra":
            carpeta = d.get("carpeta") or "Altres"
            eid = re.sub(r"[^a-z0-9]+", "-", carpeta.lower()).strip("-") or "altres"
            for a in assig:
                ex = rec(a).setdefault("extres", [])
                e = next((x for x in ex if x.get("id") == eid), None)
                if not e:
                    e = {"id": eid, "titol": carpeta, "items": []}
                    ex.append(e)
                e.setdefault("items", []).append({"titol": d.get("titol", ""), "url": url, "nota": d.get("nota", "")})

    for a, qs in preguntes.items():
        rec(a).setdefault("autoavaluacio", {})["preguntes"] = f"data/preguntes/{a}.json"
        rec(a)["_n_preguntes"] = len(qs)

    # --- idiomes ---
    ca = llegeix_json(ARREL / "data/i18n/ca.json") or {}
    for lang in ("es", "en"):
        d = llegeix_json(ARREL / f"data/i18n/{lang}.json") or {}
        falten = [k for k in ca if k not in d and not k.startswith("_")]
        if falten: avis(f"data/i18n/{lang}.json", f"{len(falten)} textos sense traduir (es mostraran en català)")

    for a in avisos: print("AVÍS  ", a)
    for e in errors: print("ERROR ", e)
    if errors:
        print(f"\n{len(errors)} error(s). Corregeix-los i torna-ho a provar.")
        sys.exit(1)
    print(f"Tot correcte: {len(subj)} assignatures, {len(fitxes)} aportacions a contingut/ "
          f"({len(sims)} simulacions, {sum(len(q) for q in preguntes.values())} preguntes).")

    if construeix:
        sortida = ARREL / "_site"
        if sortida.exists(): shutil.rmtree(sortida)
        sortida.mkdir()
        for nom in A_PUBLICAR:
            src = ARREL / nom
            if src.is_dir(): shutil.copytree(src, sortida / nom, ignore=shutil.ignore_patterns("_*", "fitxa.yml"))
            elif src.exists(): shutil.copy2(src, sortida / nom)
        (sortida / "data/recursos.json").write_text(json.dumps(recursos, ensure_ascii=False), encoding="utf-8")
        (sortida / "data/simulacions.json").write_text(json.dumps(sims, ensure_ascii=False), encoding="utf-8")
        (sortida / "data/preguntes").mkdir(exist_ok=True)
        for a, qs in preguntes.items():
            (sortida / f"data/preguntes/{a}.json").write_text(json.dumps({"preguntes": qs}, ensure_ascii=False), encoding="utf-8")
        (sortida / ".nojekyll").write_text("")
        print("Web construïda a _site/. Per veure-la: py -m http.server -d _site  i obre http://localhost:8000")

if __name__ == "__main__":
    main()
