# Com contribuir

El contingut es fa **en català** (les traduccions al castellà o l'anglès són opcionals).
Abans de començar, mira el tauler del projecte per veure què hi ha per fer.

## Què vols afegir?

| Vull afegir… | Què cal fer |
|---|---|
| **Una simulació o un objecte visual** | Copia `simulacions/_plantilla/` com a `simulacions/<id>/`, fes-hi la simulació i afegeix-la a `data/simulacions.json`. Exemple complet: `simulacions/pendol/`. |
| **Preguntes d'autoavaluació** | Crea o amplia `autoavaluacio/<id-assignatura>.json` seguint `autoavaluacio/_exemple.json`, i enllaça-ho al fitxer de recursos de l'assignatura. |
| **Vídeo, informació docent, enllaços a material, seccions extra** | Crea o edita `data/recursos/<id-assignatura>.json` seguint `data/recursos/_plantilla.json`. |
| **Apunts, problemes, exàmens o bibliografia** | Encara s'ha d'acordar on s'allotgen. De moment, obre un issue i parla-ho amb coordinació. |
| **Una guia** (Estudiar amb Claude, Pràctiques, TFG) | Edita `guies/<nom>/index.html`. |
| **Traduccions** | Edita `data/i18n/es.json` o `en.json`. Els textos que hi falten es mostren en català. |
| **Un error** | Obre un issue amb la plantilla *Error en una pàgina*, o fes directament la proposta. |

L'**identificador** de cada assignatura és el camp `id` de `data/assignatures.json`
(per exemple `fisica-atomica`, `mecanica`, `psim`). Fes-lo servir sempre.

## Fer una proposta des del navegador

1. Obre o tria un issue i assigna-te'l.
2. Al repositori, entra a la carpeta on va el teu fitxer. Fes **Add file → Upload files** per
   pujar-lo o, per editar-ne un, obre'l i prem el llapis.
3. A baix, tria **Create a new branch** i prem **Propose changes**.
4. Omple la plantilla de la proposta i envia-la.
5. GitHub comprova automàticament les dades. Si surt una creu vermella, prem *Details*:
   et diu quin fitxer i quin camp cal corregir. Corregeix-ho a la mateixa branca.
6. El teu grup revisa la física; després coordinació revisa i publica.

## Fer-ho amb Claude

Al projecte compartit de Claude de l'equip, Claude coneix aquesta estructura: demana-li la
simulació, les preguntes o el fitxer de recursos i et dirà on va cada cosa. Revisa sempre la física.
