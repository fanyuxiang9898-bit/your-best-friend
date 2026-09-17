import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { getResult, clearResult, type PersonaResult, type WordItem } from '@/data/quiz-store';
import { Button } from '@/components/ui/button';
import './index.css';

export default function ResultPage() {
  const result: PersonaResult | null = getResult();
  const [activeWord, setActiveWord] = useState<WordItem | null>(null);

  if (!result) {
    return (
      <View className="result-page bg-white min-h-screen flex items-center justify-center">
        <Text className="block text-gray-400 text-sm">暂无结果</Text>
      </View>
    );
  }

  const { title, personality_depth, friend_profile, word_cloud } = result;

  const handleWordTap = (w: WordItem) => {
    setActiveWord(w);
    setTimeout(() => setActiveWord(null), 2500);
  };

  const handleRetry = () => {
    clearResult();
    Taro.navigateBack();
  };

  // 1000×1000 画布 → 实际渲染按比例缩放
  const canvasSize = 320;

  return (
    <View className="result-page bg-white min-h-screen">
      {/* ── 顶部称号 ── */}
      <View className="px-6 pt-12 pb-4">
        <Text className="block text-xs text-gray-400 tracking-widest mb-2">YOUR PROFILE</Text>
        <Text className="block text-2xl font-bold text-gray-900">{title}</Text>
      </View>

      {/* ── Card 1: 自我剖析 ── */}
      <View className="card-self mx-4 mb-4 rounded-2xl p-6">
        <Text className="block text-xs text-gray-400 tracking-wider mb-3">SELF ANALYSIS</Text>
        <Text className="block text-sm text-gray-700 leading-relaxed">{personality_depth}</Text>
      </View>

      {/* ── Card 2: 灵魂挚友 ── */}
      <View className="card-friend mx-4 mb-4 rounded-2xl p-6">
        <View className="flex items-center mb-3">
          <Text className="block text-xs text-gray-400 tracking-wider">SOULMATE</Text>
          <Text className="block text-sm font-semibold text-gray-800 ml-3">{friend_profile.nickname}</Text>
        </View>
        <Text className="block text-sm text-gray-700 leading-relaxed">{friend_profile.friend_analysis}</Text>
      </View>

      {/* ── Card 3: 特质图谱 ── */}
      <View className="card-traits mx-4 mb-4 rounded-2xl overflow-hidden">
        <View className="px-6 pt-5 pb-2">
          <Text className="block text-xs text-gray-400 tracking-wider">TRAIT MAP</Text>
        </View>
        <View className="word-cloud-container" style={{ position: 'relative', width: '100%', height: `${canvasSize}px`, margin: '0 auto' }}>
          {word_cloud?.map((w, i) => {
            const left = (w.x / 1000) * 100;
            const top = (w.y / 1000) * 100;
            const fontSize = Math.max(10, w.size * 0.55);
            const isCenter = i === 0;
            const isActive = activeWord?.word === w.word;
            return (
              <View
                key={w.word + i}
                className="word-item"
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${fontSize}px`,
                  fontWeight: isCenter ? '700' : '400',
                  opacity: isCenter ? 1 : 0.65 + (w.size / 50) * 0.35,
                  color: isActive ? '#6366f1' : (isCenter ? '#1f2937' : '#374151'),
                  zIndex: isActive ? 10 : 1,
                  transition: 'color 0.2s, opacity 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => handleWordTap(w)}
              >
                <Text>{w.word}</Text>
              </View>
            );
          })}

          {/* 词语解释气泡 */}
          {activeWord && (
            <View
              className="word-desc-bubble"
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
              }}
            >
              <Text className="block text-xs text-gray-600 text-center">{activeWord.desc}</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── 重新测试 ── */}
      <View className="px-6 pt-4 pb-12">
        <Button variant="outline" className="w-full" onClick={handleRetry}>
          <Text>重新测试</Text>
        </Button>
      </View>
    </View>
  );
}
