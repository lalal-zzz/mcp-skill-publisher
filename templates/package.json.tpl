{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "description": "{{PROJECT_DESCRIPTION}}",
  "main": "src/index.js",
  "bin": {
    "{{PROJECT_NAME}}": "./bin/cli.js"
  },
  "files": [
    "bin/",
    "src/",
    "dist/"
  ],
  "scripts": {
    "start": "node bin/cli.js",
    "test": "echo \"No tests yet\" && exit 0",
    "build": "echo \"Build step\""
  },
  "keywords": [
    "mcp",
    "model-context-protocol",
    "claude",
    "ai"
  ],
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {},
  "engines": {
    "node": ">=18.0.0"
  }
}
