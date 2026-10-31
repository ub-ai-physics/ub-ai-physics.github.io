# Estructura de la web

*Última actualització: 31/10/2026*

## Idea

La web és una aplicació (ℏbar, de Jose) que **llegeix dades**. Per afegir contingut s'afegeixen
fitxers i línies a les dades, no es toca el codi. Cada contingut viu en un sol lloc i s'enllaça
des de totes les assignatures on és útil.

## Carpetes

```
index.html                    Estructura de la pàgina
assets/
├── hbar.js                   Codi de la web
├── hbar.css                  Estil
└── glifs.js                  Icones de les assignatures del minor
data/
├── assignatures.json         Les 70 assignatures: id, nom, codi, crèdits, tipus, semestre,
│                             requisits, pla ("actual"), resum i glif opcionals
├── simulacions.json          Registre de simulacions i objectes visuals
├── recursos/
│   ├── _plantilla.json
│   └── <id-assignatura>.json Tot el que té una assignatura a part de les simulacions
└── i18n/                     Textos de la interfície: ca.json (base), es.json, en.json
simulacions/
├── _plantilla/index.html     Punt de partida per a una simulació nova
└── <id-simulacio>/index.html
autoavaluacio/
├── _exemple.json
└── <id-assignatura>.json     Preguntes
guies/                        estudiar-amb-claude/, practiques/, tfg/ i guia.css
scripts/
├── comprova.py               Comprova les dades i construeix _site/
└── crear-etiquetes.sh
```

Un fitxer de recursos **per assignatura** evita que dues persones editin el mateix fitxer alhora.
Els fitxers que comencen per `_` són plantilles: no es publiquen.

## La fitxa d'assignatura

```
Nom, tipus, crèdits, semestre, codi, requisits
[Marca com a aprovada] [Afegeix al meu minor] [Estudiar amb Claude]
Vídeo de presentació                          ← recursos: video
Pestanyes:
├── Material d'estudi (per defecte)           carpetes; les buides no es mostren i
│   │                                         surten llistades a sota amb un enllaç a CONTRIBUIR
│   ├── Apunts · Problemes · Exàmens · Bibliografia   ← recursos: material
│   ├── Simulacions i objectes visuals        ← simulacions.json (filtrat per assignatura)
│   ├── Autoavaluació                         ← recursos: autoavaluacio (preguntes i/o app)
│   └── Extres (Laboratori, Guia del TFG…)    ← recursos: extres
└── Pla docent                                ← recursos: docencia + enllaç a la Guia Acadèmica
```

### Adreces directes

`#<assignatura>` obre la fitxa; `#<assignatura>.<secció>` obre una secció:
`pla`, `apunts`, `problemes`, `examens`, `bibliografia`, `simulacions`, `autoavaluacio`,
o `x-<id>` per a un extra. Exemple: `#fisica-atomica.autoavaluacio`.
Altres pàgines: `#` (pla d'estudis) i `#minor`.

### Barra superior

Pla d'estudis · Minor de Mates · Pràctiques (`#practiques-empresa`) · TFG (`#tfg`) ·
Estudiar amb Claude (`guies/estudiar-amb-claude/`) · selector d'idioma.
Pràctiques i TFG són assignatures del pla; la seva guia hi apareix com a extra.

## Formats

### `data/simulacions.json`

```json
{
  "id": "stern-gerlach",
  "titol": "Experiment d’Stern-Gerlach",
  "tipus": "simulacio",
  "autors": ["Nom"],
  "assignatures": ["fisica-quantica", "fisica-atomica"],
  "concepte": "Quantització de l’espín.",
  "fitxer": "simulacions/stern-gerlach/index.html",
  "estat": "esborrany",
  "revisor": ""
}
```

- `tipus`: `simulacio` o `objecte-visual`.
- `estat`: `per-portar` (encara no és a la web; surt com «en preparació»), `esborrany` o `revisat`.
  Si és `revisat`, cal omplir `revisor`.
- Traduccions opcionals: `titol_es`, `concepte_en`… i `fitxer_es`, `fitxer_en`.

### `data/recursos/<id>.json`

Vegeu `_plantilla.json`. Tots els camps són opcionals llevat d'`assignatura`.
`material` té llistes d'elements amb `titol`, `url` i, segons el cas, `tema` (posició a `temes`,
començant per 0), `solucio`, `curs`, `convocatoria`, `nota`, `autor`.

### `autoavaluacio/<id>.json`

Vegeu `_exemple.json`. `correcta` és la posició de l'opció bona començant per 0;
`simulacio` és l'id d'una simulació. Les preguntes en `esborrany` es mostren amb una etiqueta.

## Idiomes

- El català és l'idioma per defecte i l'únic obligatori.
- El selector de la barra superior canvia a castellà o anglès i es recorda en aquell navegador.
- Interfície: `data/i18n/*.json`. Qualsevol clau que falti es mostra en català.
- Contingut: camps amb sufix d'idioma (`nom_es`, `resum_en`, `titol_es`, `enunciat_en`,
  `opcions_es`…). Si no hi són, es mostra el català.

## Comprovació i publicació

`scripts/comprova.py` revisa que els JSON estiguin ben escrits, que els identificadors existeixin,
que els fitxers enllaçats hi siguin i que les preguntes siguin coherents. GitHub l'executa a cada
proposta. En publicar, a més, construeix `_site/` i hi afegeix `data/recursos.json`, que ajunta
tots els recursos en un sol fitxer perquè la web carregui més ràpid.

## Nou grau

Quan arribi, les seves assignatures s'afegiran a `data/assignatures.json` amb `"pla": "nou"`.
Caldrà un selector de pla i passar a dades les regles de crèdits que ara són al codi
(crèdits per bloc i optatives per semestre, a `renderDegree` d'`assets/hbar.js`).
