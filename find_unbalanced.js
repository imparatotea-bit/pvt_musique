// Script pour trouver exactement où les délimiteurs sont déséquilibrés
const fs = require('fs');

const content = fs.readFileSync('./script.js', 'utf8');
const lines = content.split('\n');

let braces = 0, brackets = 0, parens = 0;
let braceMin = 0, bracketMin = 0, parenMin = 0;
let braceMinLine = 0, bracketMinLine = 0, parenMinLine = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  for (let j = 0; j < line.length; j++) {
    const c = line[j];

    if (c === '{') braces++;
    if (c === '}') braces--;
    if (c === '[') brackets++;
    if (c === ']') brackets--;
    if (c === '(') parens++;
    if (c === ')') parens--;

    // Suivre les minimums (trop de fermetures)
    if (braces < braceMin) {
      braceMin = braces;
      braceMinLine = i + 1;
    }
    if (brackets < bracketMin) {
      bracketMin = brackets;
      bracketMinLine = i + 1;
    }
    if (parens < parenMin) {
      parenMin = parens;
      parenMinLine = i + 1;
    }
  }
}

console.log('=== ANALYSE DES DÉLIMITEURS ===\n');
console.log(`Accolades {}: ${braces} (${braces === 0 ? 'OK' : braces > 0 ? 'manque ' + braces + ' }' : 'trop de ' + (-braces) + ' }'})`);
if (braceMin < 0) console.log(`  Première fermeture excédentaire: ligne ${braceMinLine}`);

console.log(`Crochets []: ${brackets} (${brackets === 0 ? 'OK' : brackets > 0 ? 'manque ' + brackets + ' ]' : 'trop de ' + (-brackets) + ' ]'})`);
if (bracketMin < 0) console.log(`  Première fermeture excédentaire: ligne ${bracketMinLine}`);

console.log(`Parenthèses (): ${parens} (${parens === 0 ? 'OK' : parens > 0 ? 'manque ' + parens + ' )' : 'trop de ' + (-parens) + ' )'})`);
if (parenMin < 0) console.log(`  Première fermeture excédentaire: ligne ${parenMinLine}`);

// Recherche ligne par ligne pour trouver les déséquilibres
console.log('\n=== ANALYSE LIGNE PAR LIGNE (zones problématiques) ===\n');
braces = 0; brackets = 0; parens = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let prevBraces = braces, prevBrackets = brackets, prevParens = parens;

  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '{') braces++;
    if (c === '}') braces--;
    if (c === '[') brackets++;
    if (c === ']') brackets--;
    if (c === '(') parens++;
    if (c === ')') parens--;
  }

  // Afficher les lignes où on passe en négatif ou où il y a un gros déséquilibre
  if (braces < 0 || brackets < 0 || parens < 0 ||
      Math.abs(braces - prevBraces) > 3 ||
      Math.abs(brackets - prevBrackets) > 3 ||
      Math.abs(parens - prevParens) > 3) {
    console.log(`Ligne ${i + 1}: { ${braces} } [ ${brackets} ] ( ${parens} )`);
    console.log(`  ${line.substring(0, 100)}`);
  }
}

console.log('\n=== FIN DE L\'ANALYSE ===');
