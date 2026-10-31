# Llegeix això primer

ℏbar és la web extraoficial del Grau en Física de la UB que fem entre tots: el pla d'estudis
navegable i, per a cada assignatura, el material d'estudi. Aquí tens el que necessites per
començar a aportar-hi. Són cinc minuts.

## La idea en una frase

**Tot el que facis va a una carpeta pròpia dins de `contingut/`, amb un fitxer `fitxa.yml` que
diu a quina assignatura i a quina secció pertany.** La web el col·loca sola al lloc que toca.

```
contingut/
└── stern-gerlach/           ← la teva carpeta (minúscules, guions, sense accents)
    ├── index.html           ← el teu treball (simulació, PDF, preguntes…)
    └── fitxa.yml            ← l'etiqueta: on ha d'anar
```

```
titol: Experiment d’Stern-Gerlach
seccio: simulacions
assignatures: fisica-quantica, fisica-atomica
fitxer: index.html
autors: Robert, Carlos
estat: esborrany
```

Amb aquesta fitxa, la simulació surt a la carpeta *Simulacions i objectes visuals* de Física
Quàntica **i** de Física Atòmica. No cal tocar res més.

- **seccio:** `apunts`, `problemes`, `examens`, `bibliografia`, `simulacions`, `autoavaluacio`,
  `video` o `extra`.
- **assignatures:** l'identificador de cada assignatura (camp `id` de `data/assignatures.json`),
  separats per comes. També el veus a l'adreça de la fitxa a la web: `…/#fisica-atomica`.
- **fitxer** (un fitxer de la teva carpeta) **o enllac** (un enllaç complet, `https://…`).
- **estat:** `esborrany` quan ho pugis; només qui ho revisa ho canvia a `revisat`.

A `contingut/_plantilles/` hi ha fitxes ja fetes per a cada tipus: copia la carpeta que et
toqui, canvia-li el nom i omple-la. A `contingut/README.md` hi ha tots els camps.

## Què ha de llegir cadascú

| Si ets… | Llegeix |
|---|---|
| Qualsevol persona que vol aportar | Aquest document i `meta/guia-estil.md` |
| Membre d'un equip | La fila del teu equip a `meta/estat-del-projecte.md` (què hi ha fet i què falta) |
| Coordinació o qui toca la web | `meta/organitzacio.md` i `meta/estructura.md` |

## Pujar-ho, pas a pas

**Des del navegador** (per a una aportació petita):

1. Al repositori, entra a `contingut/` i fes **Add file → Upload files**.
2. Arrossega-hi la teva carpeta sencera, amb el treball i la `fitxa.yml`.
3. A baix, tria **Create a new branch** i prem **Propose changes**. Omple la plantilla i envia-la.

**Amb GitHub Desktop** (si treballes sovint): crea una branca, copia la teva carpeta dins de
`contingut/`, fes *Commit*, *Publish branch* i *Create Pull Request*.

Després:

4. GitHub comprova automàticament la teva fitxa. Si surt una creu vermella, prem *Details*:
   et diu quin camp cal corregir.
5. Algú del teu grup revisa la física i la coordinació ho publica.

## Veure-ho al teu ordinador abans de pujar-ho

Amb Python instal·lat, des de la carpeta del repositori:

```
py scripts/comprova.py --construeix
py -m http.server -d _site
```

i obre http://localhost:8000. (A Mac o Linux, `python3` en lloc de `py`.)

## Altres coses

- **Traduccions:** la web és en català; el castellà i l'anglès són opcionals. Textos de la
  interfície a `data/i18n/`; per traduir una aportació, afegeix a la fitxa `titol_es:`, `titol_en:`…
- **Guies** (Estudiar amb Claude, Pràctiques, TFG): són a `guies/`.
- **Material de professorat:** encara s'ha d'acordar on va. No el pugis sense parlar-ne abans.
- **Amb Claude:** al projecte compartit de l'equip, Claude coneix aquest sistema. Demana-li el
  treball i la fitxa, i revisa sempre la física.
- **Dubtes o errors:** obre un issue.
