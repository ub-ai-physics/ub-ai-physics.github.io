# Guia d'estil

*Última actualització: 31/10/2026*

## Idioma

**Català per defecte** (normativa IEC): textos, botons de les simulacions, preguntes i guies.
Tot contingut nou ha d'existir com a mínim en català. Les versions en castellà o anglès són
opcionals i es poden afegir després (vegeu *Idiomes* a `estructura.md`).
Termes tècnics en català si n'hi ha d'establerts; si cal, l'anglès entre parèntesis la primera vegada.

## Simulacions i objectes visuals

- **Una simulació = un únic fitxer HTML** autocontingut (CSS i JS a dins), a
  `simulacions/<id>/index.html`. Parteix de `simulacions/_plantilla/` (exemple: `simulacions/pendol/`).
  Biblioteques externes només de cdnjs o jsDelivr, amb la versió fixada.
- Ha d'incloure a la mateixa pàgina una **explicació del concepte**: què mostra, quins
  paràmetres es poden canviar, quina física il·lustra i què cal observar.
- Ha de funcionar al mòbil i en mode fosc (la plantilla ja ho prepara).
- Números amb coma decimal.
- **Simulacions en Python:** el navegador no les pot executar. Dues opcions:
  portar-les a JavaScript (Claude ho fa bé amb casos clàssics) o exportar-les com a
  animació (GIF o vídeo curt) i publicar-les com a *objecte visual*.
- Cada simulació té una entrada a `data/simulacions.json`:

```json
{
  "id": "stern-gerlach",
  "titol": "Experiment d'Stern-Gerlach",
  "tipus": "simulacio",
  "autors": ["Nom"],
  "assignatures": ["fisica-quantica", "fisica-atomica"],
  "concepte": "Quantització de l'espín.",
  "fitxer": "simulacions/stern-gerlach/index.html",
  "estat": "esborrany",
  "revisor": ""
}
```

`tipus`: `simulacio` o `objecte-visual`. `estat`: `per-portar`, `esborrany` o `revisat`.

## Autoavaluació

Format comú a `autoavaluacio/<assignatura>.json` (vegeu `autoavaluacio/_exemple.json`).
Cada pregunta: enunciat, opcions, resposta correcta, **explicació** (també per a qui l'encerta)
i, si n'hi ha, la simulació relacionada. L'app de Joan i la web poden llegir el mateix format.

## Notació

- LaTeX: `\( \)` en línia i `\[ \]` en bloc.
- Vectors en negreta (`\mathbf{r}`), unitats del SI, coma decimal (`9,81 m/s²`).

## Ús de Claude

- Claude ajuda, però **l'autor/a és responsable** del contingut: reviseu cada equació.
- No copieu text de llibres ni d'apunts de professors; citeu les fonts.
