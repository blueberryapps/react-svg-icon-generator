#! /usr/bin/env node
const path = require('path');
const configureGenerator = require('../lib/configureGenerator');

const argv = require('yargs')
  .options({
    reactPureRender: { type: "boolean", default: true },
    radium: { type: "boolean", default: true },
    native: { type: "boolean", default: false },
    keepFillColor: { type: "boolean", default: false },
    template: { type: "string", default: path.join(__dirname, '..', 'template', 'icon-tsx.nunjucks') },
    verbose: { type: "boolean", default: false },
  })
  .usage('Usage: \n$0 --svgDir [./assets/svgs] --destination [./src/components/Icon.jsx]')
  .demandOption(['svgDir', 'destination'])
  .argv

if (argv.verbose) {
  console.table(argv);
}

configureGenerator(argv)();
