const { program } = require('commander');
const path = require('path');
const fs = require('fs');

const { parseMarkdownTree } = require('../src/parser');
const { buildStructure } = require('../src/builder');

program
  .name('nirman')
  .description('Build a project structure from a Markdown tree file.')
  .argument('<input_file>', 'Path to the Markdown file containing the project structure.')
  .option('-o, --output <dir>', 'Target directory where the structure will be created', '.')
  .option('--dry-run', 'Print the actions that would be taken without creating files or directories')
  .option('-f, --force', 'Overwrite existing files if they are encountered')
  .action((input_file, options) => {
    const inputPath = path.resolve(process.cwd(), input_file);
    if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
      console.error(`Error: Input file not found at '${inputPath}'`);
      process.exit(1);
    }

    const validExtensions = new Set(['.md', '.markdown']);
    if (!validExtensions.has(path.extname(inputPath).toLowerCase())) {
      console.log(`\nNote: The file '${path.basename(inputPath)}' doesn't seem to be a Markdown file.\nNirman currently supports only Markdown files (.md or .markdown) for building structures.\nPlease provide a valid Markdown file and try again.`);
      process.exit(0);
    }

    const raw = fs.readFileSync(inputPath, { encoding: 'utf8' });
    const lines = raw.split(/\r?\n/);

    console.log('Parsing structure...');
    const parsed = parseMarkdownTree(lines);
    if (!parsed || parsed.length === 0) {
      console.log('Warning: Parsed tree is empty. No structure to build.');
      return;
    }

    if (options.dryRun) {
      console.log('\n--- Starting Dry Run (no changes will be made) ---');
    } else {
      console.log(`\n--- Building structure in '${path.resolve(options.output)}' ---`);
    }

    buildStructure(parsed, options.output, options.dryRun, options.force);
    console.log('\nNirman has finished.');
  });

program.parse();
