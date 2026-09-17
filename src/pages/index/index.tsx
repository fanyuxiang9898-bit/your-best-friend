import { useState, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { PersonaResult } from '@/data/quiz-store';
import { Network } from '@/network';
import { QUESTIONS } from '@/data/questions';
import { saveAnswers, saveResult } from '@/data/quiz-store';
import './index.css';

type Step = 'intro' | 'quiz' | 'calculating';

export default function IndexPage() {
  const [step, setStep] = useState<Step>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setLocalAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [animKey, setAnimKey] = useState(0);

  const handleStart = useCallback(() => {
    setStep('quiz');
    setCurrentQ(0);
    setLocalAnswers({});
    setAnimKey(prev => prev + 1);
  }, []);

  const handleAnswer = useCallback(async (key: 'A' | 'B') => {
    const questionId = QUESTIONS[currentQ].id;
    const newAnswers = { ...answers, [questionId]: key };
    setLocalAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      // 下一题
      setCurrentQ(prev => prev + 1);
      setAnimKey(prev => prev + 1);
    } else {
      // 答完，开始计算
      saveAnswers(newAnswers);
      setStep('calculating');

      try {
        const res = await Network.request({
          url: '/api/persona/calculate',
          method: 'POST',
          data: { answers: newAnswers },
        });
        console.log('[Quiz] API full response:', JSON.stringify(res).substring(0, 500));
        console.log('[Quiz] res.data type:', typeof res.data, 'keys:', res.data ? Object.keys(res.data) : 'null');

        // 兼容多层嵌套：H5 和小程序端返回结构可能不同
        let resultData: PersonaResult | null = null;
        if (res.data?.data?.title) {
          // 标准嵌套: { code, msg, data: { title, ... } }
          resultData = res.data.data;
        } else if (res.data?.title) {
          // 直接返回: { title, ... }
          resultData = res.data;
        }
        console.log('[Quiz] resultData:', resultData ? JSON.stringify(resultData).substring(0, 200) : 'null');

        if (resultData && resultData.title) {
          saveResult(resultData);
          Taro.navigateTo({ url: '/pages/result/index' });
        } else {
          Taro.showToast({ title: '正在生成中，请稍后再试', icon: 'none', duration: 2000 });
          setTimeout(() => setStep('quiz'), 2000);
        }
      } catch (err) {
        console.error('[Quiz] API error:', err);
        Taro.showToast({ title: '网络有点慢，请重试', icon: 'none', duration: 2000 });
        setTimeout(() => setStep('quiz'), 2000);
      }
    }
  }, [currentQ, answers]);

  // 落地页
  if (step === 'intro') {
    return (
      <View className="w-full h-full flex flex-col items-center justify-center px-6" style={{ background: '#FFFFFF' }}>
        <View className="flex flex-col items-center gap-6">
          <Text className="block text-3xl font-bold text-gray-800 tracking-wide">你最好的朋友</Text>
          <Text className="block text-base text-gray-500 text-center leading-relaxed">
            16 道情景题{'\n'}128 种灵魂画像{'\n'}找到属于你的那一个
          </Text>
        </View>
        <View className="mt-12 w-full max-w-xs">
          <Button
            className="w-full rounded-full text-lg py-4"
            style={{ background: 'linear-gradient(135deg, #8B7EC8 0%, #E8A0BF 100%)', color: '#fff', border: 'none' }}
            onClick={handleStart}
          >
            <Text className="text-white font-semibold">开始探索</Text>
          </Button>
        </View>
        <Text className="block mt-8 text-xs text-gray-400">约 3 分钟 · 结果仅属你自己</Text>
      </View>
    );
  }

  // 计算中
  if (step === 'calculating') {
    return (
      <View className="w-full h-full flex flex-col items-center justify-center px-6" style={{ background: '#FFFFFF' }}>
        <View className="animate-breathe flex flex-col items-center gap-4">
          <Text className="block text-5xl">✨</Text>
          <Text className="block text-lg font-medium text-gray-700">正在解读你的灵魂密码</Text>
          <Text className="block text-sm text-gray-400">请稍候...</Text>
        </View>
      </View>
    );
  }

  // 答题流程
  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <View className="w-full h-full flex flex-col" style={{ background: '#FFFFFF' }}>
      {/* 顶部进度 */}
      <View className="pt-6 px-6 pb-2">
        <View className="flex flex-row items-center justify-between mb-2">
          <Text className="block text-xs text-gray-400">{currentQ + 1} / {QUESTIONS.length}</Text>
          <Text className="block text-xs text-gray-400">{Math.round(progress)}%</Text>
        </View>
        <Progress value={progress} className="h-1" />
      </View>

      {/* 场景描述 */}
      <View className="flex-1 flex flex-col items-center justify-center px-6" key={animKey}>
        <View className="animate-fade-in-up flex flex-col items-center">
          <Text className="block text-2xl font-bold text-gray-800 text-center mb-2">
            {question.scenario}
          </Text>
          <Text className="block text-sm text-gray-400">你会选择——</Text>
        </View>
      </View>

      {/* 选项 */}
      <View className="px-6 pb-12 gap-4 flex flex-col" key={`options-${animKey}`}>
        {question.options.map((opt) => (
          <View
            key={opt.key}
            className="quiz-option rounded-2xl border-2 border-gray-200 bg-white p-5 flex flex-col active:border-purple-400"
            onClick={() => handleAnswer(opt.key)}
            hoverClass="border-purple-400"
          >
            <Text className="block text-lg font-semibold text-gray-800 mb-1">{opt.text}</Text>
            <Text className="block text-sm text-gray-400">{opt.subText}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
