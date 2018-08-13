#!/usr/bin/env node
const program = require('commander');
const LazyConsole = require('./../lib/lazyconsole');

program.command("run <alias> [args...]")
  .action(LazyConsole.execute);
program.parse(process.argv);
