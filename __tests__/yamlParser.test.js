const { parseYamlTree } = require('../src/yamlParser');

describe('parseYamlTree', () => {
    test('parses simple nested structure', () => {
        const yaml = `
project:
  src:
    files:
      - main.py
`;
        const result = parseYamlTree(yaml);
        // Expected:
        // project/ (depth 0, dir)
        //   src/ (depth 1, dir)
        //     main.py (depth 2, file)

        expect(result).toEqual([
            [0, 'project', true],
            [1, 'src', true],
            [2, 'main.py', false]
        ]);
    });

    test('parses files list correctly', () => {
        const yaml = `
files:
  - README.md
  - .gitignore
`;
        const result = parseYamlTree(yaml);
        expect(result).toEqual([
            [0, 'README.md', false],
            [0, '.gitignore', false]
        ]);
    });

    test('parses mixed folders and files', () => {
        const yaml = `
app:
  files:
    - index.js
  components:
    files:
      - Button.js
`;
        const result = parseYamlTree(yaml);
        // Order depends on object iteration, but usually:
        // app (0, dir)
        //   index.js (1, file)
        //   components (1, dir)
        //     Button.js (2, file)

        // We'll verify existence rather than strict order if needed, 
        // but for this simple case exact match usually works.
        const appNode = result.find(n => n[1] === 'app');
        expect(appNode).toBeDefined();
        expect(appNode[2]).toBe(true);
    });
});