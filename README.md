# **Nirman-cli-js**

A clean, fast CLI tool to generate project folder structures from **Markdown** or **YAML** definitions.
Stop clicking around in file explorers — describe your structure once, build it instantly.

> **Note**: This is the Node.js port of the original [Nirman-cli](https://github.com/Hemanth0411/Nirman-cli) (Python).

---

## **✨ Features**

* **Two input formats**
  * Markdown (`.md`, `.markdown`)
  * YAML (`.yml`, `.yaml`)
* **Tree-based, human-readable syntax**
* **Dry-run mode** to preview without writing
* **Force overwrite** for regenerating projects
* **Cross-platform** (Linux, macOS, Windows)
* Zero learning curve — simple, predictable behavior

---

## **📦 Installation**

```bash
npm install -g nirman-cli-js
```

---

## **🚀 Quick Start**

### **1) Markdown**

**structure.md**

```
my-node-app/
├── src/
│   ├── index.js
│   └── utils.js
├── tests/
│   └── app.test.js
└── README.md
```

Generate:

```bash
nirman structure.md
```

Creates the project inside the **current directory**.
(Use `-o` to output elsewhere.)

---

### **2) YAML**

YAML uses a clean folder → files pattern.
**Files MUST be under a `files:` key.**

**structure.yaml**

```yaml
project:
  src:
    files:
      - index.js
      - utils.js

  components:
    Button:
      files:
        - index.js
        - styles.css

  files:
    - README.md
    - .gitignore
```

Generate:

```bash
nirman structure.yaml
```

---

## **📂 Output Structure Example**

```
project/
├── src/
│   ├── index.js
│   └── utils.js
├── components/
│   └── Button/
│       ├── index.js
│       └── styles.css
├── README.md
└── .gitignore
```

---

## **🛠 CLI Reference**

```
nirman [-h] [-o OUTPUT] [--dry-run] [-f] input_file
```

### **Arguments**

| Argument     | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| `input_file` | Markdown (.md/.markdown) or YAML (.yml/.yaml) structure file |

### **Options**

| Option         | Description                                   |
| -------------- | --------------------------------------------- |
| `-o, --output` | Target directory (default: current directory) |
| `--dry-run`    | Show actions without creating anything        |
| `-f, --force`  | Overwrite existing files                      |

---

## **📘 YAML Rules (Important)**

You must follow these rules when writing YAML structures:

1. **Every folder is a dict key**

2. **Files go under the `files:` key**

   ```yaml
   files:
     - file1.js
     - file2.txt
     - config.json
   ```

3. Nested folders must be dictionaries

4. Lists can contain:

   * filenames (strings)
   * folders (dictionary items)

This enforces a clean, consistent YAML tree.

---

## **🧪 Running Tests (For Contributors)**

```bash
npm test
```

---

## **🔧 Local Development Setup**

```bash
git clone https://github.com/Hemanth0411/Nirman-cli-js
cd Nirman-cli-js
npm install
```

Run CLI from source:

```bash
node bin/index.js example.yml
```

---

## **📄 License**

This project is licensed under the [MIT](https://github.com/Hemanth0411/Nirman-cli-js/blob/main/LICENSE) License.
