name: {{PROJECT_NAME}}
description: {{PROJECT_DESCRIPTION}}

build:
  command: npm run build
  runtime: node

env: {}

entryPoints:
  - command: node
    args:
      - dist/index.js

healthCheck:
  command: node
  args:
    - -e
    - process.exit(0)
