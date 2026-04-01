import { describe, it, expect } from 'vitest';
import {
	CEFR_LEVELS,
	isValidCEFR,
	getCEFRInfo,
	getDefaultCEFR,
	type CEFRLevel,
} from './cefr.js';

describe('cefr', () => {
	describe('CEFR_LEVELS', () => {
		it('should have all 6 levels', () => {
			expect(Object.keys(CEFR_LEVELS)).toHaveLength(6);
			expect(CEFR_LEVELS).toHaveProperty('A1');
			expect(CEFR_LEVELS).toHaveProperty('A2');
			expect(CEFR_LEVELS).toHaveProperty('B1');
			expect(CEFR_LEVELS).toHaveProperty('B2');
			expect(CEFR_LEVELS).toHaveProperty('C1');
			expect(CEFR_LEVELS).toHaveProperty('C2');
		});

		it('should have correct B2 description', () => {
			expect(CEFR_LEVELS.B2.name).toBe('Upper Intermediate');
			expect(CEFR_LEVELS.B2.description).toContain('complex texts');
		});
	});

	describe('isValidCEFR', () => {
		it('should return true for valid levels', () => {
			expect(isValidCEFR('A1')).toBe(true);
			expect(isValidCEFR('a1')).toBe(true);
			expect(isValidCEFR('C2')).toBe(true);
			expect(isValidCEFR('b2')).toBe(true);
		});

		it('should return false for invalid levels', () => {
			expect(isValidCEFR('A3')).toBe(false);
			expect(isValidCEFR('D1')).toBe(false);
			expect(isValidCEFR('')).toBe(false);
			expect(isValidCEFR('invalid')).toBe(false);
		});
	});

	describe('getCEFRInfo', () => {
		it('should return info for valid level', () => {
			const info = getCEFRInfo('B2');
			expect(info).toEqual({
				name: 'Upper Intermediate',
				description: 'complex texts and technical discussion in specialization',
			});
		});
	});

	describe('getDefaultCEFR', () => {
		it('should return B2 as default', () => {
			expect(getDefaultCEFR()).toBe('B2');
		});
	});
});
