const fs = require('fs');
const path = require('path');

function buildStructure(tree, outputPath, dryRun = false, force = false) {
  if (!tree || tree.length === 0) {
    console.log('Empty tree provided. Nothing to create.');
    return;
  }

  const rootPath = path.resolve(outputPath);
  let pathStack = [rootPath];

  // Handle dot root
  let hasDotRoot = false;
  if (tree.length && tree[0][1] === '.') {
    hasDotRoot = true;
    tree = tree.slice(1).map(([depth, name, isDir]) => [depth - 1, name, isDir]);
  }

  for (let [depthRaw, name, isDirectory] of tree) {
    if (name === '.') continue;
    const depth = Math.max(0, depthRaw);
    pathStack = pathStack.slice(0, depth + 1);
    const parentIndex = depth < pathStack.length ? depth : (pathStack.length - 1);
    const parentPath = pathStack[parentIndex];
    const currentPath = path.join(parentPath, name);

    if (isDirectory) {
      console.log(`Creating DIR: ${currentPath}`);
      if (!dryRun) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      pathStack.push(currentPath);
    } else {
      console.log(`Creating FILE: ${currentPath}`);
      if (!dryRun) {
        fs.mkdirSync(path.dirname(currentPath), { recursive: true });
        if (!fs.existsSync(currentPath) || force) {
          fs.writeFileSync(currentPath, '');
        }
      }
    }
  }
}

module.exports = { buildStructure };
