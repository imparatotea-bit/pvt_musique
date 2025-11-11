// Script de diagnostic pour trouver les erreurs de syntaxe dans script.js
// Utilisation: node diagnostic.js

const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'script.js');

console.log('🔍 DIAGNOSTIC script.js\n');
console.log('Fichier:', scriptPath);

try {
  const content = fs.readFileSync(scriptPath, 'utf8');
  const lines = content.split('\n');

  console.log('Total de lignes:', lines.length);

  // Test 1: Fonctions avec déclarations divisées
  console.log('\n📋 Test 1: Déclarations de fonction divisées');
  let foundSplitFunctions = false;
  lines.forEach((line, idx) => {
    if (line.match(/function\s+anonymous\s*\(\s*$/)) {
      console.log(`  ❌ Ligne ${idx + 1}: Fonction divisée détectée`);
      console.log(`     ${line.trim()}`);
      if (idx + 1 < lines.length) {
        console.log(`     ${lines[idx + 1].trim()}`);
      }
      foundSplitFunctions = true;
    }
  });
  if (!foundSplitFunctions) {
    console.log('  ✅ Aucune fonction divisée');
  }

  // Test 2: Balance des délimiteurs
  console.log('\n📋 Test 2: Balance des délimiteurs');
  let braces = 0, brackets = 0, parens = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    const prev = i > 0 ? content[i-1] : '';

    // Gérer les strings
    if ((c === '"' || c === "'" || c === '`') && prev !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = c;
      } else if (c === stringChar) {
        inString = false;
      }
    }

    if (!inString) {
      if (c === '{') braces++;
      if (c === '}') braces--;
      if (c === '[') brackets++;
      if (c === ']') brackets--;
      if (c === '(') parens++;
      if (c === ')') parens--;
    }
  }

  console.log(`  Accolades {}: ${braces === 0 ? '✅ Équilibrées' : '❌ Déséquilibrées (' + braces + ')'}`);
  console.log(`  Crochets []: ${brackets === 0 ? '✅ Équilibrées' : '❌ Déséquilibrées (' + brackets + ')'}`);
  console.log(`  Parenthèses (): ${parens === 0 ? '✅ Équilibrées' : '❌ Déséquilibrées (' + parens + ')'}`);

  // Test 3: Ligne 733 spécifiquement
  console.log('\n📋 Test 3: Analyse ligne 733');
  if (lines.length >= 733) {
    const line733 = lines[732]; // Index 732 = ligne 733
    console.log(`  Contenu: "${line733}"`);
    console.log(`  Longueur: ${line733.length}`);

    // Caractères spéciaux
    const specialChars = [];
    for (let i = 0; i < line733.length; i++) {
      const code = line733.charCodeAt(i);
      if (code > 127 || code < 32 && code !== 9 && code !== 10 && code !== 13) {
        specialChars.push({ char: line733[i], code, pos: i });
      }
    }

    if (specialChars.length > 0) {
      console.log(`  ❌ Caractères spéciaux trouvés:`, specialChars);
    } else {
      console.log(`  ✅ Pas de caractères spéciaux`);
    }

    // Contexte
    console.log('\n  Contexte (lignes 730-736):');
    for (let i = 729; i < 736 && i < lines.length; i++) {
      const marker = i === 732 ? '→' : ' ';
      console.log(`  ${marker} ${i + 1}: ${lines[i].substring(0, 70)}`);
    }
  } else {
    console.log(`  ⚠️  Fichier trop court (${lines.length} lignes)`);
  }

  // Test 4: Syntaxe JavaScript
  console.log('\n📋 Test 4: Validation syntaxe JavaScript');
  try {
    require(scriptPath);
    console.log('  ❌ ERREUR: script.js ne devrait pas être exécutable (c\'est un objet lab.js)');
  } catch (e) {
    if (e.message.includes('is not defined') || e.message.includes('Unexpected')) {
      console.log('  ℹ️  Erreur d\'exécution normale (objet lab.js)');
    } else {
      console.log('  ❌ Erreur de syntaxe:', e.message);
    }
  }

  console.log('\n✅ Diagnostic terminé');

} catch (error) {
  console.error('❌ Erreur lors du diagnostic:', error.message);
}
