#!/usr/bin/env bash
# Crea les etiquetes del repositori. Cal GitHub CLI (gh) i haver fet `gh auth login`.
#   bash scripts/crear-etiquetes.sh
# Sense terminal: crea-les a mà a Issues > Labels amb els mateixos noms.
set -e
REPO="ub-ai-physics/ub-ai-physics.github.io"
l() { gh label create "$1" --color "$2" --description "$3" --repo "$REPO" --force; }

# Producte
l "producte: mapa"            "1d76db" "Web ℏbar, pla d'estudis i fitxes"
l "producte: simulacions"     "1d76db" "Simulacions i objectes visuals"
l "producte: autoavaluació"   "1d76db" "Preguntes i problemes conceptuals"
l "producte: vídeos"          "1d76db" "Vídeos de presentació d'assignatures"
l "producte: guies"           "1d76db" "Estudiar amb Claude, Pràctiques, TFG"
l "producte: traduccions"    "1d76db" "Castellà i anglès"
l "producte: material"        "1d76db" "Apunts, problemes, exàmens i bibliografia"

# Tipus
l "tipus: contingut-nou"      "0e8a16" "Contingut nou"
l "tipus: error"              "d73a4a" "Error de física, format o enllaç"
l "tipus: millora"            "a2eeef" "Millora d'un contingut existent"
l "tipus: coordinacio"        "5319e7" "Tasca d'organització"

# Estat
l "necessita responsable"     "e99695" "Ningú s'hi ha apuntat encara"
l "bona primera tasca"        "7057ff" "Ideal per a qui comença"
l "bloquejat"                 "b60205" "Espera una decisió o una altra tasca"
l "pilot: física atòmica"     "fbca04" "Part de la fitxa pilot"
