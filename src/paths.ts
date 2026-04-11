import { homedir } from 'node:os';
import { join } from 'node:path';

export type Tool =
	| 'opencode'
	| 'claude'
	| 'cursor'
	| 'codex'
	| 'gemini-cli'
	| 'github-copilot'
	| 'antigravity'
	| 'kiro'
	| 'other';

export interface ToolTarget {
	skillsDir: string;
	configFile: string;
	configFileName: string;
}

const HOME = homedir();

const TARGETS: Record<string, ToolTarget> = {
	opencode: {
		skillsDir: join(HOME, '.config', 'opencode', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.config', 'opencode', 'AGENTS.md'),
		configFileName: 'AGENTS.md',
	},
	claude: {
		skillsDir: join(HOME, '.claude', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.claude', 'CLAUDE.md'),
		configFileName: 'CLAUDE.md',
	},
	cursor: {
		skillsDir: join(HOME, '.cursor', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.cursorrules'),
		configFileName: '.cursorrules',
	},
	codex: {
		skillsDir: join(HOME, '.codex', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.codex', 'AGENTS.md'),
		configFileName: 'AGENTS.md',
	},
	'gemini-cli': {
		skillsDir: join(HOME, '.gemini', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.gemini', 'GEMINI.md'),
		configFileName: 'GEMINI.md',
	},
	'github-copilot': {
		skillsDir: join(HOME, '.copilot', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.copilot', 'AGENTS.md'),
		configFileName: 'AGENTS.md',
	},
	antigravity: {
		skillsDir: join(HOME, '.gemini', 'antigravity', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.gemini', 'antigravity', 'AGENTS.md'),
		configFileName: 'AGENTS.md',
	},
	kiro: {
		skillsDir: join(HOME, '.kiro', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.kiro', 'AGENTS.md'),
		configFileName: 'AGENTS.md',
	},
	other: {
		skillsDir: join(HOME, '.agents', 'skills', 'prompt2eng'),
		configFile: join(HOME, '.agents', 'AGENTS.md'),
		configFileName: 'AGENTS.md',
	},
};

export function getTargetFromTool(tool: Tool): ToolTarget {
	return TARGETS[tool] ?? TARGETS.other;
}

export function getProjectTarget(tool: Tool, cwd: string): ToolTarget {
	switch (tool) {
		case 'claude':
			return {
				skillsDir: join(cwd, '.claude', 'skills', 'prompt2eng'),
				configFile: join(cwd, 'CLAUDE.md'),
				configFileName: 'CLAUDE.md',
			};
		case 'opencode':
			return {
				skillsDir: join(cwd, '.opencode', 'skills', 'prompt2eng'),
				configFile: join(cwd, 'AGENTS.md'),
				configFileName: 'AGENTS.md',
			};
		case 'cursor':
			return {
				skillsDir: join(cwd, '.agents', 'skills', 'prompt2eng'),
				configFile: join(cwd, '.cursorrules'),
				configFileName: '.cursorrules',
			};
		case 'kiro':
			return {
				skillsDir: join(cwd, '.kiro', 'skills', 'prompt2eng'),
				configFile: join(cwd, 'AGENTS.md'),
				configFileName: 'AGENTS.md',
			};
		default:
			return {
				skillsDir: join(cwd, '.agents', 'skills', 'prompt2eng'),
				configFile: join(cwd, 'AGENTS.md'),
				configFileName: 'AGENTS.md',
			};
	}
}
