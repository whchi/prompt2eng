import { homedir } from 'node:os';
import { join } from 'node:path';

export type Tool = 'opencode' | 'claude' | 'other';

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
	if (tool === 'claude') {
		return {
			skillsDir: join(cwd, '.claude', 'skills', 'prompt2eng'),
			configFile: join(cwd, 'CLAUDE.md'),
			configFileName: 'CLAUDE.md',
		};
	}
	// opencode and other both use AGENTS.md in project root
	return {
		skillsDir:
			tool === 'opencode'
				? join(cwd, '.opencode', 'skills', 'prompt2eng')
				: join(cwd, '.agents', 'skills', 'prompt2eng'),
		configFile: join(cwd, 'AGENTS.md'),
		configFileName: 'AGENTS.md',
	};
}
