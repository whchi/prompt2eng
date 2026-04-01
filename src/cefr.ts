export const CEFR_LEVELS = {
	A1: {
		name: 'Beginner',
		description: 'basic phrases and familiar everyday expressions',
	},
	A2: {
		name: 'Elementary',
		description: 'simple sentences and frequently used expressions',
	},
	B1: {
		name: 'Intermediate',
		description: 'clear standard communication on familiar matters',
	},
	B2: {
		name: 'Upper Intermediate',
		description: 'complex texts and technical discussion in specialization',
	},
	C1: {
		name: 'Advanced',
		description: 'fluent expression without much searching for expressions',
	},
	C2: {
		name: 'Proficient',
		description: 'near-native precision and nuance',
	},
} as const;

export type CEFRLevel = keyof typeof CEFR_LEVELS;

export function isValidCEFR(level: string): level is CEFRLevel {
	return level.toUpperCase() in CEFR_LEVELS;
}

export function getCEFRInfo(level: CEFRLevel) {
	return CEFR_LEVELS[level];
}

export function getDefaultCEFR(): CEFRLevel {
	return 'B2';
}
