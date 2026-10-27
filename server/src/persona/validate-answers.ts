export function isValidAnswers(value: unknown): value is Record<string, 'A' | 'B'> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const answers = value as Record<string, unknown>;
  if (Object.keys(answers).length !== 16) return false;
  return Array.from({ length: 16 }, (_, i) => String(i + 1)).every(
    key => Object.prototype.hasOwnProperty.call(answers, key) && (answers[key] === 'A' || answers[key] === 'B'),
  );
}
