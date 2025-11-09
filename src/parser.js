const RESERVED_NAMES = new Set([
  'con', 'prn', 'aux', 'nul',
  'com1','com2','com3','com4','com5','com6','com7','com8','com9',
  'lpt1','lpt2','lpt3','lpt4','lpt5','lpt6','lpt7','lpt8','lpt9',
  '.', '..'
]);

const INVALID_CHARS_REGEX = /[<>:"|?*]/g;

function parseMarkdownTree(lines) {
  const tree = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].replace(/\r?\n$/, '');
    if (!line.trim()) continue;

    // Skip lines with long dashes or malformed connectors
    if (/-{3,}|─{3,}/.test(line)) {
      console.warn(`Warning: Skipping malformed line ${i + 1}: '${line.trim()}'`);
      continue;
    }
    if (/(─-)|(-─)|(--─)|(─--)/.test(line)) {
      console.warn(`Warning: Skipping malformed connector on line ${i + 1}: '${line.trim()}'`);
      continue;
    }

    // Split by common connectors
    const parts = line.split(/--|──/);
    let rawName;
    let prefix = '';

    if (parts.length > 1) {
      rawName = parts[parts.length - 1].trim();
      // attempt to find prefix fragment to calculate depth
      const prefixEndIndex = line.lastIndexOf(parts[parts.length - 2]) + parts[parts.length - 2].length;
      prefix = line.slice(0, prefixEndIndex);
    } else {
      rawName = line.trim().split(/\s+/)[0];
      prefix = '';
    }

    if (!rawName) continue;

    let cleanName = rawName.split(/\s+/)[0];

    let depth = 0;
    if (!prefix) depth = 0;
    else depth = Math.floor(prefix.length / 4) + 1;

    let isDirectory = /[\\/]\s*$/.test(rawName);

    // strip trailing slashes and sanitize
    cleanName = rawName.replace(/[\\/]+$/, '');
    cleanName = cleanName.replace(INVALID_CHARS_REGEX, '_');

    const baseName = cleanName.split('.')[0];
    if (RESERVED_NAMES.has(baseName.toLowerCase())) {
      cleanName = `_${cleanName}`;
    }

    if (cleanName === '.' && depth === 0) {
      isDirectory = true;
    }

    tree.push([depth, cleanName, isDirectory]);
  }

  // Post process to infer directories
  for (let i = 0; i < tree.length - 1; i++) {
    const [currDepth, currName, currIsDir] = tree[i];
    const [nextDepth] = tree[i + 1];
    if (!currIsDir && nextDepth > currDepth) {
      tree[i][2] = true;
    }
  }

  return tree;
}

module.exports = { parseMarkdownTree };
