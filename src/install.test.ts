import { describe, it, expect, vi, beforeEach } from 'vitest';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

vi.mock('node:fs');
vi.mock('node:fs/promises');
vi.mock('prompts');

import { installConfig } from './install.js';
import { getTargetFromTool } from './paths.js';

const mockTarget = getTargetFromTool('other');
const baseOpts = {
	target: mockTarget,
	skillName: 'prompt2eng',
	skillDescription: 'Test description.',
	cwd: '/tmp/test',
};

describe('installConfig', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('does not create config when file does not exist', async () => {
		vi.mocked(existsSync).mockReturnValue(false);

		await installConfig(baseOpts);

		expect(writeFile).not.toHaveBeenCalled();
	});

	it('updates config when file exists and user confirms', async () => {
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readFile).mockResolvedValue('# Config\n' as any);
		const prompts = await import('prompts');
		vi.mocked(prompts.default).mockResolvedValue({ shouldUpdate: true });

		await installConfig(baseOpts);

		// backup + updated file written
		expect(writeFile).toHaveBeenCalledTimes(2);
	});

	it('skips update when user declines', async () => {
		vi.mocked(existsSync).mockReturnValue(true);
		vi.mocked(readFile).mockResolvedValue('# Config\n' as any);
		const prompts = await import('prompts');
		vi.mocked(prompts.default).mockResolvedValue({ shouldUpdate: false });

		await installConfig(baseOpts);

		expect(writeFile).not.toHaveBeenCalled();
	});
});
