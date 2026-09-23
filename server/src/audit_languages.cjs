const fs = require('fs');
const path = require('path');
const targetFile = path.resolve(__dirname, '../../client/src/context/LanguageContext.jsx');
let code = fs.readFileSync(targetFile, 'utf8');
code = code.replace(/import React[^;]+;/, '');
code = code.replace(/export const LANGUAGES =[^;]+;/, '');
const provIdx = code.indexOf('const LanguageContext');
if (provIdx !== -1) {
  code = code.substring(0, provIdx);
}
code = code.replace(/export const TRANSLATIONS =/, 'const TRANSLATIONS =');

const script = code + '\n' +
'const enKeys = Object.keys(TRANSLATIONS.en);\n' +
'console.log("Total EN keys:", enKeys.length);\n' +
'Object.keys(TRANSLATIONS).forEach(lang => {\n' +
'  const langKeys = Object.keys(TRANSLATIONS[lang]);\n' +
'  const missing = enKeys.filter(k => !(k in TRANSLATIONS[lang]));\n' +
'  console.log(`${lang}: total = ${langKeys.length}, missing = ${missing.length}`);\n' +
'  if (missing.length > 0) {\n' +
'    console.log(`  Missing in ${lang} (${missing.length} keys):`, missing);\n' +
'  }\n' +
'});\n';

fs.writeFileSync('temp_eval.js', script);
try {
  require('./temp_eval.js');
} catch (e) {
  console.error('Eval error:', e);
} finally {
  if (fs.existsSync('temp_eval.js')) fs.unlinkSync('temp_eval.js');
}
