import prompts from 'prompts';
import chalk from 'chalk';
import { homedir } from 'node:os';
import {
	type ToolTarget,
	type Tool,
	getTargetFromTool,
	getProjectTarget,
} from './paths.js';
import type { CEFRLevel } from './cefr.js';
import { generateSkill } from './generate.js';
import { installConfig } from './install.js';

export interface InteractiveResult {
	tool: Tool;
	lang: string;
	cefr: CEFRLevel;
	target: ToolTarget;
}

// ── BCP-47 language list ──────────────────────────────────────────────────────

const LANGUAGE_CONFIG: Record<string, { name: string; regions: string[] }> = {
	zh: { name: 'Chinese', regions: ['TW', 'HK', 'CN'] },
	ja: { name: 'Japanese', regions: ['JP'] },
	ko: { name: 'Korean', regions: ['KR'] },
	es: { name: 'Spanish', regions: ['ES', 'MX'] },
	ru: { name: 'Russian', regions: ['RU'] },
	fr: { name: 'French', regions: ['FR', 'CA'] },
	de: { name: 'German', regions: ['DE', 'CH'] },
	pt: { name: 'Portuguese', regions: ['BR'] },
	it: { name: 'Italian', regions: ['IT', 'CH'] },
};

const REGION_NAMES: Record<string, string> = {
	TW: 'Taiwan',
	HK: 'Hong Kong',
	CN: 'China',
	JP: 'Japan',
	KR: 'South Korea',
	ES: 'Spain',
	MX: 'Mexico',
	RU: 'Russia',
	FR: 'France',
	CA: 'Canada',
	DE: 'Germany',
	CH: 'Switzerland',
	BR: 'Brazil',
	IT: 'Italy',
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG);

function buildLanguageChoices() {
	return SUPPORTED_LANGUAGES.map((code) => ({
		title: `${code} — ${LANGUAGE_CONFIG[code].name}`,
		value: code,
	}));
}

function getRegionChoices(baseLang: string) {
	const config = LANGUAGE_CONFIG[baseLang];
	if (!config) return [{ title: '(none)', value: '' }];

	const regions = config.regions;
	if (regions.length === 0) return [{ title: '(none)', value: '' }];

	return regions.map((r) => ({
		title: `${r} — ${REGION_NAMES[r] ?? r}`,
		value: r,
	}));
}

const CEFR_OPTIONS = [
	{ title: 'A1 — Beginner', value: 'A1' },
	{ title: 'A2 — Elementary', value: 'A2' },
	{ title: 'B1 — Intermediate', value: 'B1' },
	{ title: 'B2 — Upper Intermediate (recommended)', value: 'B2' },
	{ title: 'C1 — Advanced', value: 'C1' },
	{ title: 'C2 — Proficient', value: 'C2' },
];

const TOOL_NAMES: Record<string, string> = {
	opencode: 'OpenCode',
	claude: 'Claude Code',
	cursor: 'Cursor',
	codex: 'Codex',
	'gemini-cli': 'Gemini CLI',
	'github-copilot': 'GitHub Copilot',
	antigravity: 'Antigravity',
	kiro: 'Kiro CLI',
	other: 'Other',
};

// ── helpers ───────────────────────────────────────────────────────────────────

function aborted(value: unknown): boolean {
	return value === undefined;
}

function getScopePath(tool: string, scope: 'global' | 'project'): string {
	const fakeTarget =
		scope === 'global'
			? getTargetFromTool(tool as Tool)
			: getProjectTarget(tool as Tool, process.cwd());
	return scope === 'global'
		? fakeTarget.skillsDir.replace(homedir(), '~').replace(/\/prompt2eng$/, '')
		: fakeTarget.skillsDir
				.replace(process.cwd(), '')
				.replace(/^\//, '')
				.replace(/\/prompt2eng$/, '');
}

// ── main ──────────────────────────────────────────────────────────────────────

export async function runInteractive(): Promise<void> {
	console.log(chalk.cyan.bold('\nPrompt To English Skill Generator\n'));

	// Step 1 — tool
	const { tool } = await prompts({
		type: 'select',
		name: 'tool',
		message: 'Which AI tool are you using?',
		choices: [
			{ title: 'opencode', value: 'opencode' },
			{ title: 'claude code', value: 'claude' },
			{ title: 'cursor', value: 'cursor' },
			{ title: 'codex', value: 'codex' },
			{ title: 'gemini cli', value: 'gemini-cli' },
			{ title: 'github copilot', value: 'github-copilot' },
			{ title: 'antigravity', value: 'antigravity' },
			{ title: 'kiro cli', value: 'kiro' },
			{ title: 'other (.agents/ like cline…)', value: 'other' },
		],
	});
	if (aborted(tool)) return cancel();

	// Step 2 — scope
	const { scope } = await prompts({
		type: 'select',
		name: 'scope',
		message: 'Where do you want to install the skill?',
		choices: [
			{
				title: `Global  (${getScopePath(tool, 'global')})`,
				value: 'global',
			},
			{
				title: `Project  (${getScopePath(tool, 'project')})`,
				value: 'project',
			},
		],
	});
	if (aborted(scope)) return cancel();

	const cwd = process.cwd();
	const target =
		scope === 'global' ? getTargetFromTool(tool) : getProjectTarget(tool, cwd);
	console.log(
		chalk.gray(
			`  → config: ${target.configFile}\n  → skills: ${target.skillsDir}\n`,
		),
	);

	// Step 3 — base language
	const languageChoices = buildLanguageChoices();
	const { baseLang } = await prompts({
		type: 'autocomplete',
		name: 'baseLang',
		message: 'Your language tag (type to search):',
		choices: languageChoices,
		suggest: (input: string, choices: any[]) => {
			const q = input.toLowerCase();
			return Promise.resolve(
				choices.filter(
					(c: any) =>
						c.value?.toLowerCase().startsWith(q) ||
						c.title?.toLowerCase().includes(q),
				),
			);
		},
	});
	if (aborted(baseLang)) return cancel();

	// Step 4 — region
	const regionChoices = getRegionChoices(baseLang);
	let region = '';

	if (regionChoices.length === 1 && regionChoices[0].value !== '') {
		region = regionChoices[0].value;
		console.log(chalk.gray(`  → region: ${region}`));
	} else if (regionChoices.length > 1) {
		const result = await prompts({
			type: 'select',
			name: 'region',
			message: `Region for ${chalk.cyan(baseLang)}?`,
			choices: regionChoices,
		});
		if (aborted(result.region)) return cancel();
		region = result.region;
	}

	const finalTag = region ? `${baseLang}-${region}` : baseLang;
	console.log(chalk.green(`\n  ✓ BCP-47 tag: ${chalk.bold(finalTag)}\n`));

	// Step 5 — CEFR
	const { cefr } = await prompts({
		type: 'select',
		name: 'cefr',
		message: 'Target English level (CEFR):',
		choices: CEFR_OPTIONS,
		initial: CEFR_OPTIONS.findIndex((o) => o.value === 'B2'),
	});
	if (aborted(cefr)) return cancel();

	// Step 6 — confirm
	console.log('');
	console.log(
		chalk.gray('  Tool:     ') + chalk.cyan(TOOL_NAMES[tool] ?? 'Other'),
	);
	console.log(
		chalk.gray('  Scope:    ') +
			chalk.cyan(
				scope === 'global'
					? `Global (${getScopePath(tool, 'global')})`
					: `Project (${getScopePath(tool, 'project')})`,
			),
	);
	console.log(chalk.gray('  Language: ') + chalk.cyan(finalTag));
	console.log(chalk.gray('  CEFR:     ') + chalk.cyan(cefr));
	console.log(chalk.gray('  Skills:   ') + chalk.cyan(target.skillsDir));
	console.log('');

	const { confirmed } = await prompts({
		type: 'confirm',
		name: 'confirmed',
		message: 'Generate skill with these settings?',
		initial: true,
	});
	if (!confirmed) return cancel();

	// Step 7 — generate
	const skillInfo = await generateSkill({ lang: finalTag, cefr, target, cwd });

	// Step 8 — install config
	await installConfig({
		target,
		skillName: skillInfo.skillName,
		skillDescription: skillInfo.skillDescription,
		cwd,
	});

	console.log(chalk.green('\n✓ Done!'));
	console.log(chalk.gray(`Skill: ${skillInfo.skillPath}`));
}

function cancel(): void {
	console.log(chalk.yellow('\nCancelled.'));
}
