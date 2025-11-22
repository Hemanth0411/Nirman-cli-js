const yaml = require('js-yaml');

function parseYamlTree(yamlText) {
    const data = yaml.load(yamlText);
    const tree = [];

    function walk(node, depth) {
        if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
            // Dictionary / Object
            for (const [key, value] of Object.entries(node)) {
                // Special case: 'files' key
                if (key === 'files') {
                    if (Array.isArray(value)) {
                        value.forEach(item => {
                            tree.push([depth, String(item), false]);
                        });
                    } else {
                        tree.push([depth, String(value), false]);
                    }
                    continue;
                }

                // Normal folder
                tree.push([depth, key, true]);
                walk(value, depth + 1);
            }
        } else if (Array.isArray(node)) {
            // List / Array
            node.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    for (const [key, value] of Object.entries(item)) {
                        tree.push([depth, key, true]);
                        walk(value, depth + 1);
                    }
                } else {
                    tree.push([depth, String(item), false]);
                }
            });
        } else {
            // Leaf node (string, number, etc.)
            tree.push([depth, String(node), false]);
        }
    }

    walk(data, 0);
    return tree;
}

module.exports = { parseYamlTree };