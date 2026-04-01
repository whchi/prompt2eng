import { CEFRLevel, isValidCEFR } from './cefr.js';
import { isValidLanguageCode, normalizeLanguageCode } from './languages.js';

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

export function validateLanguageCode(code: string): ValidationResult {
	const normalized = normalizeLanguageCode(code);
	if (isValidLanguageCode(normalized)) return { valid: true, errors: [] };
	return {
		valid: false,
		errors: [
			`Invalid language tag "${code}". Use a valid BCP-47 tag (e.g. ja, zh-TW, en-US).`,
		],
	};
}

export function validateCEFRLevel(level: string): ValidationResult {
	if (isValidCEFR(level.toUpperCase())) return { valid: true, errors: [] };
	return {
		valid: false,
		errors: [
			`Invalid CEFR level "${level}". Valid levels: A1, A2, B1, B2, C1, C2.`,
		],
	};
}

export { getDefaultCEFR, type CEFRLevel } from './cefr.js';
export { normalizeLanguageCode, isValidLanguageCode } from './languages.js';
