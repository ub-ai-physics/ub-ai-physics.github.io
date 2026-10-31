# Organització de l'equip

*Última actualització: 31/10/2026*

## Rols

- **Supervisor (Vincent):** direcció del projecte i validació general.
- **Coordinació (Ulises, Vincent):** estructura, dades, revisió final i publicació;
  manteniment de `meta/` i del projecte de Claude.
- **Responsable de producte:** organitza el seu producte (mapa, simulacions, autoavaluació,
  vídeos, guies) i en revisa les propostes (nivell 1).
- **Padrí/padrina d'assignatura:** qui s'encarrega de completar la fitxa d'una assignatura
  (recull material, demana simulacions i preguntes). Ideal per a qui s'incorpora.
- **Contribuïdor/a:** proposa i fa contingut.

## Flux de treball a GitHub

1. Tria o proposa una tasca al tauler (issue) i assigna-te-la.
2. Fes el contingut seguint `guia-estil.md` (amb el projecte de Claude si vols).
3. Obre una proposta (pull request). La plantilla et recorda les comprovacions, i GitHub
   comprova automàticament les dades (`scripts/comprova.py`).
4. **Revisió nivell 1:** el grup responsable comprova la física. Si és correcta, aprova i
   canvia l'estat a `revisat` indicant qui ho ha revisat.
5. **Revisió nivell 2:** l'Ulises o en Vincent comproven format, dades i enllaços i fan Merge.
   La web s'actualitza en un o dos minuts.

## Material de classe: proposta de Drive (pendent d'acordar)

*Proposta de coordinació per discutir amb l'equip; no és cap decisió presa.*


- **Unitat compartida** de Google Drive, amb una carpeta per assignatura (nom = `id`) i a dins
  `apunts`, `problemes`, `examens`, `bibliografia` i `bustia`.
- **Rols:**
  - *Lector*: tothom qui tingui l'enllaç (o el grup d'estudiants).
  - *Col·laborador*: pot afegir i editar, però no eliminar ni moure.
  - *Gestor de contingut*: moderadors; revisen la bústia, ordenen i eliminen.
  - *Gestor*: coordinació.
- La web **només enllaça** a les carpetes. Qui pot veure què ho decideix el Drive.

### Criteris sobre el material

- Material fet per estudiants (apunts propis, resolucions): és el nucli del Drive.
- Material de professorat (apunts, enunciats d'examen): es manté **només al Drive**, mai a
  GitHub, i es retira si l'autor/a ho demana.
- El projecte vol fer d'aquest material una cosa revisada i fiable; si un professor detecta un
  error o té una objecció, s'atén ràpidament. Això també és el que ens fa diferents del Drive actual.

## Configuració de GitHub (administradors)

- **Equips** (`github.com/orgs/ub-ai-physics/teams`): `coordinacio`, `mapa`, `simulacions`,
  `autoavaluacio`, `videos`, `guies`. Amb permís d'escriptura perquè CODEOWNERS funcioni.
- **Protecció de `main`:** exigir pull request, 1 aprovació i *Require review from Code Owners*.

## Tauler (GitHub Projects)

`github.com/orgs/ub-ai-physics/projects` → *New project* → *Board*.
Columnes: **Per assignar · En curs · En revisió · Fet**. Activa els *workflows* perquè els
issues nous entrin a *Per assignar* i els tancats passin a *Fet*. Camps útils: *Producte*,
*Assignatura*.

## Canals

- **Campus Virtual:** avisos i convocatòries.
- **Issues de GitHub:** discussió d'una tasca concreta.
- **Projecte compartit de Claude:** produir i revisar contingut amb les regles comunes.
- **Reunions:** decisions grans i repartiment.

Si una decisió afecta més d'una persona, queda escrita a un issue o a `estat-del-projecte.md`.

## Visibilitat i caràcter extraoficial

La web és pública (GitHub Pages) i extraoficial. El peu de pàgina ho diu i remet a la web
oficial de la Facultat. No es publica res intern de l'equip ni cap anàlisi sobre el nou grau.

## Llicència (pendent)

Proposta: CC BY-NC-SA 4.0 per al contingut propi i MIT per al codi. Pendent de parlar-ho amb Vincent.
