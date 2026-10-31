# Estat del projecte

*Última actualització: 31/10/2026 · Manté: Ulises*

## Què és

Una web **extraoficial**, feta per i per a estudiants del Grau en Física de la UB, publicada a
https://ub-ai-physics.github.io. Parteix de la web ℏbar de Jose: el pla d'estudis navegable i, per a
cada assignatura, la informació docent i el material d'estudi. Supervisor: Vincent.
Tot el contingut és **en català**. És un prototip: l'objectiu és tenir l'estructura feta perquè
sigui fàcil d'omplir i ampliar.

## Equips i responsables

| Producte | Què hi va | Responsables | Punt de partida |
|---|---|---|---|
| Coordinació i estructura | Arquitectura, dades, revisió final | Ulises, Vincent | — |
| Mapa del grau i fitxes | La web ℏbar: pla d'estudis, prerequisits, fitxes | Jose | Web ℏbar (prototip funcional) |
| Simulacions i objectes visuals | Simulacions amb explicació del concepte, enllaçades a assignatures | Robert, Carlos (+ un company); autor/a del *Laboratorio Virtual* | 4 simulacions en Python; Rutherford (autor/a per confirmar) |
| Autoavaluació | Preguntes conceptuals i problemes curts amb explicació | Joan; autor/a del *Laboratorio Virtual* | App pròpia (externa); *Laboratorio Virtual* |
| Vídeos | Vídeo de ~5 min per assignatura | Antonio | Idea |
| Estudiar amb Claude | Guia per estudiar amb eines d'IA | Unai | Web *Study with Claude* (en anglès) |
| Pràctiques | Guia de les pràctiques curriculars | Miquel | Idea |
| TFG | Guia del TFG i directori de professorat | Ulises | Prototip en curs |
| Física Atòmica (contingut) | Material de l'assignatura | Lluc, Lucas, Òscar | Material fet |

> El *Laboratorio Virtual* combina teoria, simulació i test: la persona que l'ha fet és el
> **pont entre Simulacions i Autoavaluació** i ha de coordinar-se amb tots dos equips
> (format de les simulacions i format comú de preguntes).

## Decisions preses

- **Idioma:** català per defecte. Es podrà triar castellà o anglès amb un selector a la
  cantonada superior; les traduccions són opcionals i, si no n'hi ha, es mostra el català.
- **Web pública a GitHub Pages**, basada en ℏbar. Desapareix MkDocs.
- **Fitxa d'assignatura:** vídeo a dalt; pestanyes *Pla docent* i *Material d'estudi*
  (Apunts, Problemes, Exàmens, Bibliografia, Simulacions i objectes visuals, Autoavaluació i
  seccions extra si cal); botó *Estudiar amb Claude*.
- **Barra superior:** Pla d'estudis, Minor de Mates, Pràctiques, TFG, Estudiar amb Claude.
- **Identificadors d'assignatura:** els de `data/assignatures.json` (heretats de ℏbar).
- **L'app de Joan** pot continuar sent externa; la web hi enllaça per assignatura.
- **Validació en dos nivells:** el grup revisa la física; coordinació revisa i publica.
- **Nou grau (previst per al 2028-29):** no s'hi treballa encara. Les dades porten el camp
  `pla` perquè s'hi pugui afegir sense refer l'estructura.

## Fet

- [x] Estructura del repositori i de la web basada en ℏbar (dades separades del codi).
- [x] Fitxa d'assignatura amb vídeo, *Pla docent* i *Material d'estudi* (incloses Simulacions
      i objectes visuals i Autoavaluació), botó *Estudiar amb Claude* i barra superior.
- [x] Selector d'idioma (català per defecte; castellà i anglès per a la interfície).
- [x] Comprovació automàtica de les propostes i publicació automàtica.
- [x] Plantilles: simulació, recursos d'assignatura, preguntes, issues i propostes.

## Tasques obertes

- [ ] Que Jose revisi l'adaptació de ℏbar (`assets/hbar.js`).
- [ ] Crear equips a l'organització de GitHub, etiquetes i tauler; protegir `main`.
- [ ] Acordar on va el material de classe (vegeu *Decisions pendents*).
- [ ] Revisar `data/assignatures.json` contra la Guia Acadèmica (curs 2026-27).
- [ ] Portar les simulacions de Robert (Python) a HTML o exportar-les com a animació.
- [ ] Identificar l'autor/a de *Rutherford* i pujar-la.
- [ ] Identificar l'autor/a del *Laboratorio Virtual* i posar-lo en contacte amb Simulacions i Autoavaluació.
- [ ] Acordar amb Joan el format comú de preguntes (`autoavaluacio/_exemple.json`).
- [ ] Traduir *Study with Claude* al català i posar-la a `guies/estudiar-amb-claude/`.
- [ ] Guia de pràctiques (Miquel) i guia del TFG amb el directori de professorat (Ulises).
- [ ] **Fitxa pilot completa: Física Atòmica i Radiació** (ja té 3 preguntes d'exemple i 3 simulacions en preparació).
- [ ] Preparar les tasques disponibles per a la reunió del 4 de novembre.

## Decisions pendents

- **On va el material de classe** (apunts, problemes, exàmens, bibliografia). Proposta de
  coordinació: una unitat compartida de Drive amb rols (vegeu `organitzacio.md`), i que la web
  només hi enllaci. Cal acordar-ho amb l'equip.
- **Abast de les traduccions:** només la interfície o també el contingut; quines llengües.

- Llicència del contingut i del codi.
- On s'allotgen els vídeos (YouTube ocult, plataforma de la UB…).
- Si s'aprova el Drive: qui el modera (gestors de contingut).

## Calendari

- **Dimecres 4 de novembre, 10:30, sala Pere Pascual:** segona reunió i assignació de tasques.
- Proposta: tenir la fitxa pilot de Física Atòmica a punt per ensenyar-la.

## Persones

| Nom | Usuari de GitHub | Equip |
|---|---|---|
| Vincent | | Coordinació (supervisor) |
| Ulises | | Coordinació, TFG |
| Jose | | Mapa |
| Robert | | Simulacions |
| Carlos | | Simulacions |
| Joan | | Autoavaluació |
| Antonio | | Vídeos |
| Unai | | Estudiar amb Claude |
| Miquel | | Pràctiques |
| Lluc, Lucas, Òscar | | Física Atòmica |
