import test from 'node:test';
import assert from 'node:assert/strict';
import { formatResultSummary } from '../src/data/result-summary.ts';

test('copyable result contains all readable sections and no layout coordinates', () => {
  const text = formatResultSummary({ title: '探索者', personality_depth: '喜欢创造', friend_profile: { nickname: '同行者', friend_analysis: '互相支持' }, word_cloud: [{ word: '好奇', desc: '愿意探索', x: 123, y: 456, size: 40 }] });
  for (const value of ['探索者', '喜欢创造', '同行者', '互相支持', '好奇', '不代表心理诊断']) assert.ok(text.includes(value));
  assert.ok(!text.includes('123'));
});
