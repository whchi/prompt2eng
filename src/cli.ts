#!/usr/bin/env node
import { Command } from 'commander';
import { runInteractive } from './interactive.js';

const program = new Command();

program
	.name('prompt2eng')
	.description('Generate customized prompt2eng skills for AI agents')
	.version('1.0.0')
	.action(async () => {
		await runInteractive();
	});

program.parse();
