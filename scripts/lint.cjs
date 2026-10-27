const fs = require('node:fs');
const path = require('node:path');
const { loadESLint } = require('eslint');

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.(?:js|jsx|ts|tsx|css)$/.test(file) ? [file] : [];
  });
}

(async () => {
  // Explicit file paths avoid version-dependent Windows directory glob matching.
  // ESLint still applies the complete project configuration to every source file.
  const files = sourceFiles(path.resolve(__dirname, '../src'));
  if (!files.length) throw new Error('No source files found; refusing an empty lint pass');
  const ESLint = await loadESLint({ useFlatConfig: true });
  const fix = process.argv.includes('--fix');
  const eslint = new ESLint({ fix });
  const results = await eslint.lintFiles(files);
  if (fix) await ESLint.outputFixes(results);
  const errors = results.reduce((total, result) => total + result.errorCount, 0);
  const warnings = results.reduce((total, result) => total + result.warningCount, 0);
  const displayed = process.argv.includes('--quiet') ? ESLint.getErrorResults(results) : results;
  const output = (await eslint.loadFormatter('stylish')).format(displayed);
  if (output) console.log(output);
  console.log(`Linted ${results.length} source files: ${errors} errors, ${warnings} warnings`);
  process.exitCode = errors || (warnings && process.argv.includes('--max-warnings=0')) ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
