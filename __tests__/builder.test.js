const fs = require('fs');
const path = require('path');
const { buildStructure } = require('../src/builder');

const SAMPLE_TREE = [
  [0, "project-root", true],
  [1, "src", true],
  [2, "main.py", false],
  [1, "README.md", false],
];

test('creates structure', () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'nirman-'));
  buildStructure(SAMPLE_TREE, tmp);

  expect(fs.existsSync(path.join(tmp, 'project-root'))).toBe(true);
  expect(fs.existsSync(path.join(tmp, 'project-root', 'src'))).toBe(true);
  expect(fs.existsSync(path.join(tmp, 'project-root', 'src', 'main.py'))).toBe(true);
  expect(fs.existsSync(path.join(tmp, 'project-root', 'README.md'))).toBe(true);
});

test('dry run creates nothing', () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'nirman-'));
  buildStructure(SAMPLE_TREE, tmp, true);
  const entries = fs.readdirSync(tmp);
  expect(entries.length).toBe(0);
});

test('force overwrite', () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'nirman-'));
  const readme = path.join(tmp, 'project-root', 'README.md');
  fs.mkdirSync(path.dirname(readme), { recursive: true });
  fs.writeFileSync(readme, 'old content');
  buildStructure(SAMPLE_TREE, tmp, false, false);
  expect(fs.readFileSync(readme, 'utf8')).toBe('old content');
  buildStructure(SAMPLE_TREE, tmp, false, true);
  expect(fs.readFileSync(readme, 'utf8')).toBe('');
});
