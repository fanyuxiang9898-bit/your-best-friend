// 性格测试结果类型定义

export interface WordItem {
  word: string;
  x: number;
  y: number;
  size: number;
  desc: string;
}

export interface FriendProfile {
  nickname: string;
  friend_analysis: string;
}

export interface PersonaResult {
  title: string;
  personality_depth: string;
  friend_profile: FriendProfile;
  word_cloud: WordItem[];
}

let resultCache: PersonaResult | null = null;
let answersCache: Record<string, string> | null = null;

export function saveAnswers(answers: Record<string, string>) {
  answersCache = answers;
}

export function getAnswers(): Record<string, string> | null {
  return answersCache;
}

export function saveResult(data: PersonaResult) {
  resultCache = data;
}

export function getResult(): PersonaResult | null {
  return resultCache;
}

export function clearResult() {
  resultCache = null;
}
