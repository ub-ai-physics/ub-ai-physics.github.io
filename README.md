# ℏbar · Física UB

Web extraoficial feta per i per a estudiants del Grau en Física de la UB: el pla d'estudis
navegable i, per a cada assignatura, la informació docent i el material d'estudi.

- **Web:** https://ub-ai-physics.github.io
- **Per començar a aportar-hi:** [CONTRIBUIR.md](CONTRIBUIR.md)
- **Organització de l'equip:** [meta/](meta/)

No és una web oficial de la Universitat de Barcelona.

## Com està feta

La web és una sola pàgina (`index.html` + `assets/`) que llegeix les dades de `data/`.
Per afegir contingut **no cal tocar el codi**: s'afegeixen fitxers i línies a les dades.
Detalls a [meta/estructura.md](meta/estructura.md).

```
contingut/               TOTES les aportacions: una carpeta per aportació, amb fitxa.yml
index.html, assets/      La web (ℏbar, de Jose)
data/                    Assignatures, informació docent per assignatura, textos (ca/es/en)
guies/                   Estudiar amb Claude, Pràctiques, TFG
scripts/comprova.py      Comprova les fitxes i construeix la web
meta/                    Documents interns de l'equip (no es publiquen)
```

## Publicació

Cada canvi que entra a `main` es comprova i es publica sol en un o dos minuts
(`.github/workflows/deploy.yml`). Cada proposta es comprova automàticament abans de revisar-la.

## Provar-la al teu ordinador

Cal Python 3. Des de la carpeta del repositori:

```
py scripts/comprova.py --construeix
py -m http.server -d _site
```

(A Mac o Linux, `python3` en lloc de `py`.)

i obre http://localhost:8000. (Obrir `index.html` directament amb doble clic no funciona,
perquè el navegador no deixa llegir les dades.)
