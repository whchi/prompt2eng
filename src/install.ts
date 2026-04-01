import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import prompts from 'prompts';
import chalk from 'chalk';
import { ToolTarget } from './paths.js';
import { SKILL_NAME } from './generate.js';

export interface InstallOptions {
	target: ToolTarget;
	skillName: string;
	skillDescription: string;
	cwd: string;
}

const SECTION_HEADER = '## Required Skills';

export async function installConfig(options: InstallOptions): Promise<void> {
	const { target, skillName, skillDescription } = options;
	const { configFile, configFileName } = target;
	const entry = `- **${skillName}**: ${skillDescription}`;

	// Config file does not exist — print suggestion only, do not create
	if (!existsSync(configFile)) {
		console.log('');
		console.log(chalk.yellow(`${configFileName} not found at ${configFile}`));
		console.log(
			chalk.gray('Add the following snippet to your config file manually:\n'),
		);
		printSuggestion(entry);
		return;
	}

	// Config file exists — ask whether to update
	const { shouldUpdate } = await prompts({
		type: 'confirm',
		name: 'shouldUpdate',
		message: `Found ${configFileName}. Add skill to "${SECTION_HEADER}"?`,
		initial: true,
	});

	if (!shouldUpdate) {
		console.log('');
		console.log(chalk.gray('Skipped. Add the following snippet manually:\n'));
		printSuggestion(entry);
		return;
	}

	const original = await readFile(configFile, 'utf-8');
	// Backup before modifying
	await writeFile(`${configFile}.bak`, original);

	const updated = upsertSkillEntry(original, entry);
	await writeFile(configFile, updated);

	console.log(chalk.green(`  ✓ Updated ${configFileName}`));
}

// ── helpers ───────────────────────────────────────────────────────────────────

function printSuggestion(entry: string): void {
	console.log(chalk.cyan(`${SECTION_HEADER}\n\n${entry}`));
	console.log('');
}

function upsertSkillEntry(content: string, entry: string): string {
	const sectionIdx = content.indexOf(SECTION_HEADER);

	if (sectionIdx === -1) {
		// Append section at end
		const suffix = content.endsWith('\n') ? '' : '\n';
		return `${content}${suffix}\n${SECTION_HEADER}\n\n${entry}\n`;
	}

	// Find section boundaries
	const afterHeader = sectionIdx + SECTION_HEADER.length;
	const nextSectionMatch = content.slice(afterHeader).match(/\n## /);
	const sectionEnd = nextSectionMatch
		? afterHeader + nextSectionMatch.index!
		: content.length;

	const sectionBody = content.slice(afterHeader, sectionEnd);

	// Already listed — update in place
	if (sectionBody.includes(SKILL_NAME)) {
		const pattern = new RegExp(`^- \\*\\*${SKILL_NAME}\\*\\*:.*$`, 'm');
		const newBody = sectionBody.replace(pattern, entry);
		return content.slice(0, afterHeader) + newBody + content.slice(sectionEnd);
	}

	// Append to section
	const trimmed = sectionBody.trimEnd();
	const newBody = trimmed.length ? `${trimmed}\n${entry}\n` : `\n\n${entry}\n`;
	return content.slice(0, afterHeader) + newBody + content.slice(sectionEnd);
}
