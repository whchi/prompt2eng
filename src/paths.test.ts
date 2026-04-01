import { describe, it, expect } from 'vitest';
import { getTargetFromTool } from './paths.js';

describe('paths', () => {
	it('claude maps to .claude paths and CLAUDE.md', () => {
		const t = getTargetFromTool('claude');
		expect(t.skillsDir).toContain('.claude/skills/prompt2eng');
		expect(t.configFileName).toBe('CLAUDE.md');
	});

	it('other maps to .agents paths and AGENTS.md', () => {
		const t = getTargetFromTool('other');
		expect(t.skillsDir).toContain('.agents/skills/prompt2eng');
		expect(t.configFileName).toBe('AGENTS.md');
	});
});
