# contingut/

Aquí va **tot** el que aporta l'equip. Cada aportació és una carpeta amb el treball i un fitxer
`fitxa.yml` que diu on ha d'anar. Les carpetes que comencen per `_` (com `_plantilles/`) no es publiquen.

## Nom de la carpeta

Minúscules, sense accents ni espais, paraules separades per guions: `stern-gerlach`,
`apunts-optica-tema-2`. És l'identificador de l'aportació (per exemple, una pregunta l'utilitza
per enllaçar a una simulació).

## Camps de `fitxa.yml`

Una línia per camp, `camp: valor`. El que va després d'un `#` és un comentari.

| Camp | Obligatori | Què és |
|---|---|---|
| `titol` | sí | Títol que es veu a la web |
| `seccio` | sí | `apunts`, `problemes`, `examens`, `bibliografia`, `simulacions`, `autoavaluacio`, `video` o `extra` |
| `assignatures` | sí | Ids de `data/assignatures.json`, separats per comes |
| `fitxer` | o `enllac` | Nom d'un fitxer de la carpeta |
| `enllac` | o `fitxer` | Enllaç complet (`https://…`) |
| `autors` | recomanat | Noms separats per comes |
| `estat` | recomanat | `esborrany` (per defecte), `revisat` o `per-portar` (encara no està fet; surt com «en preparació») |
| `revisor` | si `revisat` | Qui ho ha revisat |
| `concepte` | simulacions | Una frase sobre la física que il·lustra |
| `tipus` | simulacions | `simulacio` (per defecte) o `objecte-visual` (animació, imatge, vídeo curt) |
| `tema` | opcional | Número del tema (1, 2, 3…), per a apunts i problemes |
| `solucio` | opcional | Fitxer o enllaç de la solució (problemes, exàmens) |
| `curs`, `convocatoria` | exàmens | Per exemple `2024-25` i `Final` |
| `durada` | vídeo | Per exemple `5 min` |
| `carpeta` | extra | Nom de la carpeta extra on surt (per exemple `Laboratori` o `Sortides de camp`) |
| `nota` | opcional | Comentari breu |
| `titol_es`, `titol_en`, `concepte_es`… | opcional | Traduccions |

## Què fa cada secció

- **apunts, problemes, examens, bibliografia:** surten a la carpeta corresponent de cada assignatura.
- **simulacions:** a *Simulacions i objectes visuals*. El fitxer és un `index.html` autocontingut
  (plantilla a `_plantilles/simulacio/`).
- **autoavaluacio:** amb `fitxer: preguntes.json` (format a `_plantilles/preguntes/`), les preguntes
  surten a la web; amb `enllac:`, surt un botó cap a una app externa.
- **video:** el vídeo de presentació que surt a dalt de la fitxa de l'assignatura.
- **extra:** carpetes especials d'algunes assignatures, amb el nom que posis a `carpeta:`.

Exemples reals: `pendol/` (simulació acabada), `stern-gerlach/` (en preparació),
`preguntes-fisica-atomica/` (preguntes).
