import { describe, it, expect } from 'vitest';
import {
	isValidLanguageCode,
	normalizeLanguageCode,
	suggestLanguageCode,
	getLanguageName,
} from './languages.js';

describe('languages', () => {
	describe('isValidLanguageCode', () => {
		it('should validate common language codes', () => {
			expect(isValidLanguageCode('ja')).toBe(true);
			expect(isValidLanguageCode('ko')).toBe(true);
			expect(isValidLanguageCode('zh')).toBe(true);
			expect(isValidLanguageCode('es')).toBe(true);
			expect(isValidLanguageCode('en')).toBe(true);
		});

		it('should validate BCP 47 tags', () => {
			expect(isValidLanguageCode('zh-TW')).toBe(true);
			expect(isValidLanguageCode('zh-CN')).toBe(true);
			expect(isValidLanguageCode('en-US')).toBe(true);
		});

		it('should reject invalid codes', () => {
			expect(isValidLanguageCode('xyz')).toBe(false);
			expect(isValidLanguageCode('')).toBe(false);
		});
	});

	describe('normalizeLanguageCode', () => {
		it('should normalize to lowercase', () => {
			expect(normalizeLanguageCode('JA')).toBe('ja');
			expect(normalizeLanguageCode('EN')).toBe('en');
		});

		it('should preserve region codes', () => {
			expect(normalizeLanguageCode('zh-TW')).toBe('zh-TW');
			expect(normalizeLanguageCode('ZH-tw')).toBe('zh-tw');
		});
	});

	describe('suggestLanguageCode', () => {
		it('should suggest corrections for common mistakes', () => {
			const suggestions = suggestLanguageCode('jp');
			expect(suggestions).toContain('ja');
		});

		it('should suggest ko for kr', () => {
			const suggestions = suggestLanguageCode('kr');
			expect(suggestions).toContain('ko');
		});
	});

	describe('getLanguageName', () => {
		it('should return correct names', () => {
			expect(getLanguageName('ja')).toBe('Japanese');
			expect(getLanguageName('ko')).toBe('Korean');
			expect(getLanguageName('zh-TW')).toBe('Traditional Chinese');
			expect(getLanguageName('zh-CN')).toBe('Simplified Chinese');
		});
	});
});
