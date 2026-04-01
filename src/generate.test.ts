import { describe, it, expect } from 'vitest';
import { SKILL_NAME } from './generate.js';

describe('generate', () => {
	it('SKILL_NAME is fixed to prompt2eng', () => {
		expect(SKILL_NAME).toBe('prompt2eng');
	});
});
