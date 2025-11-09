const { parseMarkdownTree } = require('../src/parser');

const MARKDOWN_INPUT = [
  "project-root/",
  "├── src/",
  "│   ├── main.py",
  "│   └── utils/",
  "│       └── helper.py",
  "├── tests/",
  "│   └── test_main.py",
  "└── README.md",
];

const EXPECTED_OUTPUT = [
  [0, "project-root", true],
  [1, "src", true],
  [2, "main.py", false],
  [2, "utils", true],
  [3, "helper.py", false],
  [1, "tests", true],
  [2, "test_main.py", false],
  [1, "README.md", false],
];

test('parse standard markdown tree', () => {
  const parsed = parseMarkdownTree(MARKDOWN_INPUT);
  expect(parsed).toEqual(EXPECTED_OUTPUT);
});
