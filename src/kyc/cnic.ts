/**
 * Pakistani CNIC format validator — format check only, not NADRA verification.
 * Not legal advice. See DISCLAIMER.md.
 */

export interface CnicValidationResult {
  valid: boolean;
  normalized?: string;
  formatted?: string;
  errors: string[];
}

const DIGITS_ONLY = /^\d{13}$/;
const FORMATTED = /^\d{5}-\d{7}-\d{1}$/;

/**
 * Validate Pakistani CNIC format: 13 digits, optionally `xxxxx-xxxxxxx-x`.
 * Does not verify authenticity or perform identity checks.
 */
export function validateCnic(value: string): CnicValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, errors: ["CNIC is empty"] };
  }

  if (FORMATTED.test(trimmed)) {
    const normalized = trimmed.replace(/-/g, "");
    return {
      valid: true,
      normalized,
      formatted: trimmed,
      errors: [],
    };
  }

  if (DIGITS_ONLY.test(trimmed)) {
    const formatted = `${trimmed.slice(0, 5)}-${trimmed.slice(5, 12)}-${trimmed.slice(12)}`;
    return {
      valid: true,
      normalized: trimmed,
      formatted,
      errors: [],
    };
  }

  return {
    valid: false,
    errors: [
      "CNIC must be 13 digits or formatted as xxxxx-xxxxxxx-x (format check only; not identity verification)",
    ],
  };
}
