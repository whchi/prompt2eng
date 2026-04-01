import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import chalk from 'chalk';
import { type CEFRLevel, getCEFRInfo } from './cefr.js';
import { getLanguageName } from './languages.js';
import type { ToolTarget } from './paths.js';

export const SKILL_NAME = 'prompt2eng';

export interface GenerateOptions {
	lang: string;
	cefr: CEFRLevel;
	target: ToolTarget;
	cwd: string;
}

export interface GenerateResult {
	skillPath: string;
	skillName: string;
	skillDescription: string;
}

export async function generateSkill(
	options: GenerateOptions,
): Promise<GenerateResult> {
	const { lang, cefr, target } = options;

	const languageName = getLanguageName(lang);
	const cefrInfo = getCEFRInfo(cefr);
	const examplesData = await loadExamples();
	const examples = getExamples(lang, examplesData);

	const templateData = {
		skillName: SKILL_NAME,
		languageName,
		cefrLevel: cefr,
		cefrDescription: cefrInfo.description,
		...examples,
	};

	// skill dir is fixed: target.skillsDir already includes "prompt2eng"
	await mkdir(target.skillsDir, { recursive: true });

	const templatePath = join(
		dirname(fileURLToPath(import.meta.url)),
		'..',
		'templates',
		'SKILL.md.hbs',
	);

	const templateContent = await readFile(templatePath, 'utf-8');
	const skillContent = Handlebars.compile(templateContent)(templateData);

	const skillPath = join(target.skillsDir, 'SKILL.md');
	await writeFile(skillPath, skillContent);

	console.log(chalk.green(`  ✓ Skill written to ${skillPath}`));

	const skillDescription =
		`Use when the user's prompt contains ${languageName} text that needs translation to English before processing. ` +
		`Translates ${languageName} to CEFR ${cefr} English while preserving existing English, technical terms, and proper nouns.`;

	return { skillPath, skillName: SKILL_NAME, skillDescription };
}

// ── examples ──────────────────────────────────────────────────────────────────

async function loadExamples(): Promise<
	Record<string, Array<{ input: string; output: string }>>
> {
	const filePath = join(
		dirname(fileURLToPath(import.meta.url)),
		'..',
		'templates',
		'languages.json',
	);
	const content = await readFile(filePath, 'utf-8');
	return JSON.parse(content);
}

function getExamples(
	lang: string,
	data: Record<string, Array<{ input: string; output: string }>>,
) {
	const base = lang.split('-')[0].toLowerCase();
	const examples = data[base] ?? data.zh;
	return { examples };
}
