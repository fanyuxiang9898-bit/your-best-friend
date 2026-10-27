import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidAnswers } from '../server/src/persona/validate-answers.ts';
const complete = Object.fromEntries(Array.from({ length: 16 }, (_, i) => [String(i + 1), 'A']));
test('accepts exactly sixteen valid answers', () => {
  assert.equal(isValidAnswers(complete), true);
  assert.equal(isValidAnswers({ ...complete, 16: 'B' }), true);
});
test('rejects incomplete, malformed and additional answers', () => {
  for (const value of [null, [], {}, { ...complete, 1: 'C' }, { ...complete, 17: 'A' }]) assert.equal(isValidAnswers(value), false);
  const missing = { ...complete }; delete missing['1']; assert.equal(isValidAnswers(missing), false);
});
