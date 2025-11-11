#!/bin/bash
# Script de lancement du serveur local pour l'expérience PVT

echo "========================================="
echo "  Serveur HTTP pour PVT Musique"
echo "========================================="
echo ""
echo "Démarrage du serveur sur le port 8000..."
echo ""

# Trouver Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ ERREUR : Python n'est pas installé"
    echo "Installez Python 3 : https://www.python.org/downloads/"
    exit 1
fi

# Lancer le serveur
echo "✓ Python trouvé : $PYTHON_CMD"
echo ""
echo "🌐 Ouvrez votre navigateur et allez à :"
echo ""
echo "    http://localhost:8000/index.html"
echo ""
echo "========================================="
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo "========================================="
echo ""

$PYTHON_CMD -m http.server 8000
