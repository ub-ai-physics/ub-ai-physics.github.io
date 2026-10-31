# Estructura de la web

*Última actualització: 31/10/2026*

## Idea

- **Un sol lloc per aportar:** `contingut/`. Cada aportació és una carpeta amb el treball i un
  `fitxa.yml` que diu a quines assignatures i a quina secció va.
- **Un pas automàtic ho col·loca:** `scripts/comprova.py` llegeix totes les fitxes, comprova
  que siguin correctes i genera les dades que llegeix la web.
- **La web (ℏbar, de Jose) només llegeix dades.** Per afegir contingut no es toca el codi.

## Carpetes

```
contingut/
├── README.md                 Tots els camps de fitxa.yml
├── _plantilles/              simulacio/, apunts/, preguntes/, video/ (no es publiquen)
└── <nom-aportacio>/          treball + fitxa.yml
index.html                    Estructura de la pàgina
assets/                       hbar.js (codi), hbar.css (estil), glifs.js (icones del minor)
data/
├── assignatures.json         Les 70 assignatures: id, nom, codi, crèdits, tipus, semestre,
│                             requisits, pla ("actual"), resum i glif opcionals
├── recursos/<id>.json        Informació que manté coordinació: docència, temes, extres fixos
│                             (p. ex. la guia de Pràctiques i del TFG). Plantilla: _plantilla.json
└── i18n/                     Textos de la interfície: ca.json (base), es.json, en.json
guies/                        estudiar-amb-claude/, practiques/, tfg/ i guia.css
scripts/
├── comprova.py               Comprova i construeix _site/
└── crear-etiquetes.sh
```

## Què genera `comprova.py --construeix`

A `_site/` (no es guarda al repositori; GitHub el construeix en publicar):

- `data/recursos.json`: per a cada assignatura, `data/recursos/<id>.json` més tot el que hi
  apunta des de `contingut/` (material, vídeo, autoavaluació, extres).
- `data/simulacions.json`: totes les aportacions amb `seccio: simulacions`.
- `data/preguntes/<id>.json`: les preguntes de totes les aportacions d'autoavaluació
  d'aquella assignatura, ajuntades.

## La fitxa d'assignatura

```
Nom, tipus, crèdits, semestre, codi, requisits
[Marca com a aprovada] [Afegeix al meu minor] [Estudiar amb Claude]
Vídeo de presentació                          ← seccio: video
Pestanyes:
├── Material d'estudi (per defecte): carpetes, com a la web original de Jose.
│   Les buides surten amb vora discontínua i, en obrir-les, expliquen com omplir-les
│   amb la fitxa ja preparada per a aquella assignatura.
│   ├── Apunts · Problemes · Exàmens · Bibliografia   ← seccio: apunts, problemes…
│   ├── Simulacions i objectes visuals        ← seccio: simulacions
│   ├── Autoavaluació                         ← seccio: autoavaluacio
│   └── Extres (Laboratori, Guia del TFG…)    ← seccio: extra, o data/recursos
└── Pla docent                                ← data/recursos: docencia + Guia Acadèmica
```

### Adreces directes

`#<assignatura>` obre la fitxa; `#<assignatura>.<secció>` obre una carpeta:
`pla`, `apunts`, `problemes`, `examens`, `bibliografia`, `simulacions`, `autoavaluacio`,
o `x-<id>` per a un extra. Exemple: `#fisica-atomica.autoavaluacio`.
Altres pàgines: `#` (pla d'estudis) i `#minor`.

### Barra superior

Pla d'estudis · Minor de Mates · Pràctiques (`#practiques-empresa`) · TFG (`#tfg`) ·
Estudiar amb Claude (`guies/estudiar-amb-claude/`) · selector d'idioma.

## Formats

- **`fitxa.yml`:** vegeu `contingut/README.md`.
- **Preguntes:** `{"preguntes": [ {id, enunciat, opcions, correcta, explicacio, simulacio} ]}`.
  `correcta` és la posició de l'opció bona començant per 0; `simulacio`, el nom de la carpeta
  d'una simulació. Traduccions opcionals: `enunciat_es`, `opcions_en`, `explicacio_es`…
- **`data/recursos/<id>.json`:** vegeu `_plantilla.json`. `temes` és la llista de temes de
  l'assignatura; el camp `tema: 2` d'una fitxa vol dir el segon d'aquesta llista.

## Idiomes

- El català és l'idioma per defecte i l'únic obligatori.
- El selector canvia a castellà o anglès i es recorda en aquell navegador.
- Interfície: `data/i18n/*.json`; el que falti es mostra en català.
- Contingut: camps amb sufix (`titol_es`, `concepte_en`…). Si no hi són, es mostra el català.

## Comprovació i publicació

GitHub executa `scripts/comprova.py` a cada proposta (`.github/workflows/comprova.yml`) i, a
cada canvi a `main`, construeix i publica la web a la branca `gh-pages`
(`.github/workflows/deploy.yml`).

## Nou grau

Quan arribi, les seves assignatures s'afegiran a `data/assignatures.json` amb `"pla": "nou"`.
Caldrà un selector de pla i passar a dades les regles de crèdits que ara són al codi
(crèdits per bloc i optatives per semestre, a `renderDegree` d'`assets/hbar.js`).
