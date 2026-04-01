import { iso6393, type Language } from 'iso-639-3';

export interface LanguageInfo {
	code: string;
	name: string;
	iso6391?: string;
	iso6393: string;
}

export function getLanguageName(code: string): string {
	// Try to find by ISO 639-1 code first
	const byIso1 = iso6393.find(
		(lang: Language) => lang.iso6391 === code.toLowerCase(),
	);
	if (byIso1) {
		return byIso1.name;
	}

	// Try by ISO 639-3 code
	const byIso3 = iso6393.find(
		(lang: Language) => lang.iso6393 === code.toLowerCase(),
	);
	if (byIso3) {
		return byIso3.name;
	}

	// Handle special cases like zh-TW, zh-CN, etc.
	if (code.toLowerCase().startsWith('zh-')) {
		const region = code.split('-')[1]?.toUpperCase();
		switch (region) {
			case 'TW':
			case 'HANT':
				return 'Traditional Chinese';
			case 'CN':
			case 'HANS':
				return 'Simplified Chinese';
			default:
				return 'Chinese';
		}
	}

	// Fallback: capitalize the code
	return code.charAt(0).toUpperCase() + code.slice(1);
}

export function isValidLanguageCode(code: string): boolean {
	const lowerCode = code.toLowerCase();

	// Check ISO 639-1
	if (iso6393.some((lang: Language) => lang.iso6391 === lowerCode)) {
		return true;
	}

	// Check ISO 639-3
	if (iso6393.some((lang: Language) => lang.iso6393 === lowerCode)) {
		return true;
	}

	// Handle BCP 47 tags with script/region
	const baseCode = lowerCode.split('-')[0];
	if (
		iso6393.some(
			(lang: Language) =>
				lang.iso6391 === baseCode || lang.iso6393 === baseCode,
		)
	) {
		return true;
	}

	return false;
}

export function suggestLanguageCode(code: string): string[] {
	const suggestions: string[] = [];
	const lowerCode = code.toLowerCase();

	// Common mistakes
	const corrections: Record<string, string> = {
		jp: 'ja',
		kr: 'ko',
		cn: 'zh',
		tw: 'zh-TW',
		hk: 'zh-HK',
		in: 'hi',
		sp: 'es',
		fr: 'fr',
	};

	if (corrections[lowerCode]) {
		suggestions.push(corrections[lowerCode]);
	}

	// Case correction
	if (lowerCode !== code) {
		suggestions.push(lowerCode);
	}

	// Find similar codes
	const similar = iso6393
		.filter((lang: Language) => {
			const nameLower = lang.name.toLowerCase();
			return (
				nameLower.includes(lowerCode) ||
				lowerCode.includes(nameLower.substring(0, 3))
			);
		})
		.slice(0, 3);

	similar.forEach((lang: Language) => {
		if (lang.iso6391 && !suggestions.includes(lang.iso6391)) {
			suggestions.push(lang.iso6391);
		}
	});

	return suggestions.filter((s) => s !== code).slice(0, 3);
}

export function normalizeLanguageCode(code: string): string {
	// Convert to lowercase for ISO codes, keep region codes uppercase
	const parts = code.split('-');
	if (parts.length === 1) {
		return parts[0].toLowerCase();
	}
	return parts[0].toLowerCase() + '-' + parts.slice(1).join('-');
}
