#!/usr/bin/env node
const program = require('commander');
const LazyConsole = require('./../lib/lazyconsole');

const dependencies = {
  fileSystem: require('fs'),
  process: require('child_process')
};

const LazyController = LazyConsole.getController(dependencies);

program.command("run <alias> [args...]").action(LazyController.execute);

program.parse(process.argv);
