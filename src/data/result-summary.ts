import type { PersonaResult } from './quiz-store';

export function formatResultSummary(result: PersonaResult): string {
  return [
    result.title,
    '',
    '自我剖析',
    result.personality_depth,
    '',
    `灵魂挚友：${result.friend_profile.nickname}`,
    result.friend_profile.friend_analysis,
    '',
    `我的特质：${result.word_cloud.map(item => item.word).join('、')}`,
    '',
    '仅供自我探索与娱乐，不代表心理诊断。',
  ].join('\n');
}
