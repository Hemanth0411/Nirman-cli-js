const { program } = require('commander');
const path = require('path');
const fs = require('fs');

const { parseMarkdownTree } = require('../src/parser');
const { parseYamlTree } = require('../src/yamlParser'); // [NEW] Import YAML parser
const { buildStructure } = require('../src/builder');

program
  .name('nirman')
  .description('Build a project structure from a Markdown or YAML file.') // [MODIFIED] Description
  .argument('<input_file>', 'Path to the structure file (.md, .markdown, .yml, .yaml)')
  .option('-o, --output <dir>', 'Target directory where the structure will be created', '.')
  .option('--dry-run', 'Print the actions that would be taken without creating files or directories')
  .option('-f, --force', 'Overwrite existing files if they are encountered')
  .action((input_file, options) => {
    const inputPath = path.resolve(process.cwd(), input_file);
    if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
      console.error(`Error: Input file not found at '${inputPath}'`);
      process.exit(1);
    }

    const ext = path.extname(inputPath).toLowerCase();
    const validExtensions = new Set(['.md', '.markdown', '.yml', '.yaml']); // [MODIFIED] Add YAML extensions

    if (!validExtensions.has(ext)) {
      console.log(`\nNote: The file '${path.basename(inputPath)}' has an unsupported extension.\nNirman supports: .md, .markdown, .yml, .yaml\nPlease provide a valid file and try again.`);
      process.exit(0);
    }

    const raw = fs.readFileSync(inputPath, { encoding: 'utf8' });

    console.log('Parsing structure...');

    let parsed = [];

    // [NEW] Logic to choose parser
    if (ext === '.yml' || ext === '.yaml') {
      try {
        parsed = parseYamlTree(raw);
      } catch (e) {
        console.error('Error parsing YAML:', e.message);
        process.exit(1);
      }
    } else {
      const lines = raw.split(/\r?\n/);
      parsed = parseMarkdownTree(lines);
    }

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