import { Injectable } from '@nestjs/common';
import { LLMClient } from 'coze-coding-dev-sdk';

// ─────────── 64 特质词库（含释义） ───────────

const TRAIT_WORDS: Record<string, { word: string; desc: string }[]> = {
  healing: [
    { word: '电子布洛芬', desc: '一出现就不疼了，专治精神内耗' },
    { word: '夸夸神教编外人员', desc: '不加入组织但疯狂输出彩虹屁' },
    { word: '人类猫草', desc: '让人忍不住靠近蹭一蹭' },
    { word: '恒温36度5', desc: '永远不烫手也不冰冷，刚刚好' },
    { word: '深夜放映机', desc: '凌晨两点还在给你推片的那种人' },
    { word: '坏情绪碎纸机', desc: '你说的糟心事TA听完就帮你撕了' },
    { word: '行走的充电宝', desc: '见你第一面就问：需要充吗' },
    { word: '云端抱抱机', desc: '不在身边也能让你感觉被抱住' },
    { word: '反焦虑大师', desc: '你慌的时候TA比你还淡定' },
    { word: '互联网亲妈', desc: '嘘寒问暖到你觉得被养了' },
    { word: '精神股东', desc: '你的人生大事TA比你还上心' },
    { word: '滤镜大师', desc: '看你永远带美颜，越看越顺眼' },
    { word: '情绪止损线', desc: '你快炸的时候TA就是那根线' },
    { word: '暖宝宝平替', desc: '虽然便宜但真的管用' },
    { word: '人间清醒剂', desc: '你上头的时候一针下去就清醒' },
    { word: '避风港租客', desc: '不是房东，但永远占着一个位置' },
  ],
  rational: [
    { word: '活体小红书', desc: '攻略笔记比博主还专业' },
    { word: '冷静的灭火器', desc: '谁炸了TA都不炸' },
    { word: '逻辑怪兽', desc: '吵架从没输过，因为TA说的都对' },
    { word: '莫得感情的ATM', desc: '借钱不看心情看概率' },
    { word: '方案提供商', desc: '你吐槽TA直接甩方案' },
    { word: '人形碎钞机检测员', desc: '花冤枉钱之前先问TA' },
    { word: '大脑外挂', desc: '你算不过来的TA秒出答案' },
    { word: '甲方克星', desc: '无理需求在TA面前自动退散' },
    { word: '24小时人工智障', desc: '虽然不太聪明但永远在线' },
    { word: '稳如老狗', desc: '天塌了TA先顶着，表情不变' },
    { word: '真相打击者', desc: '你骗自己TA来拆穿' },
    { word: '避坑指南', desc: '走过的弯路TA全帮你标出来了' },
    { word: '六边形战士', desc: '什么都会，还都不差' },
    { word: '人生导师体验卡', desc: '有效期一天，但够用了' },
    { word: '冷静的背景板', desc: '你不看TA，但TA一直在' },
    { word: '智商保税区', desc: '跟TA说话不用担心降智' },
  ],
  fun: [
    { word: '社交悍匪', desc: '没TA暖不起来的场子' },
    { word: '梗图自动贩卖机', desc: '永远有新货，笑着笑着就哭了' },
    { word: '废话文学家', desc: '说的全是废话但就是停不下来' },
    { word: '顶级摸鱼搭子', desc: '一起摸鱼才是真朋友' },
    { word: '快乐喷泉', desc: '喷出来的全是快乐水' },
    { word: '离谱事件见证人', desc: '你离谱的时候TA都在场' },
    { word: '当代互联网邻居', desc: '不常联系但一直在线' },
    { word: '专业陪饭员', desc: '你吃啥TA都陪，还不抢你的' },
    { word: '精神病院逃友', desc: '正常人的面具戴不住' },
    { word: '盲盒型损友', desc: '每次见面不知道是损还是友' },
    { word: '八卦搬运工', desc: '圈子里的消息TA最先知道' },
    { word: '气氛组组长', desc: '冷场？不存在的' },
    { word: '反emo先锋', desc: '你emo TA来蹦迪' },
    { word: '快乐笨蛋', desc: '不聪明但真的很快乐' },
    { word: '脑洞维修工', desc: '你的脑洞坏了TA来修' },
    { word: '人间弹幕', desc: '你干啥TA都在旁边飘评论' },
  ],
  depth: [
    { word: '极光观测者', desc: '等得到等不到都愿意守着' },
    { word: '深海潜水员', desc: '你沉到最深处TA也跟得下去' },
    { word: '孤独豁免权', desc: 'TA在的时候孤独自动失效' },
    { word: '沉默的守望者', desc: '不说话但一直在看' },
    { word: '精神流浪者', desc: '没目的地，但走哪算哪' },
    { word: '内心考古学家', desc: '你埋得再深TA也挖得到' },
    { word: '世界上的另一个我', desc: '照镜子一样的感觉' },
    { word: '影子收藏家', desc: '你的暗面TA全都收着' },
    { word: '时空旅伴', desc: '好像认识不止这一辈子' },
    { word: '共鸣共振器', desc: '你一个眼神TA就懂了' },
    { word: '灵魂翻译官', desc: '你说不出口的TA帮你翻译' },
    { word: '旧时光磁带', desc: '翻出来还能放，全是回忆' },
    { word: '精神乌托邦', desc: '跟TA在一起就是另一个世界' },
    { word: '隐形羽翼', desc: '你看不见但一直托着你' },
    { word: '命运合伙人', desc: '不是选择，是注定的' },
    { word: '回声定位器', desc: '你迷失了TA帮你找到自己' },
  ],
};

// ─────────── 128 性格定性称号 ───────────

const TITLES: Record<string, string[]> = {
  '000': ['高功能孤独者', '静默深海体'],
  '001': ['社交永动机', '人形WiFi塔'],
  '010': ['直觉系逃逸者', '灵感走私犯'],
  '011': ['冰山社交造梦机', '理性暴走族'],
  '100': ['共情核反应堆', '情绪吸铁石'],
  '101': ['热力解题王', '冷静火山口'],
  '110': ['慢速深潜器', '拖延哲学家'],
  '111': ['秩序内的潜行者', '精密失控体'],
};

// D1D2D3 前3位 → 称号组
// D4D5D6D7 后4位 → 变体选择

// ─────────── 挚友称号 ───────────

const FRIEND_NICKNAMES: Record<string, string[]> = {
  complement: ['人间暂停键', '情绪创可贴', '野生充电线', '人形安眠药'],
  mirror: ['行走的退烧贴', '恒温平替', '精神代糖', '佛系催化剂'],
  rhythm: ['节奏破坏者', '时间窃贼', '放空合伙人', '摸鱼共犯'],
  boundary: ['领地爆破手', '社交踢门人', '安全距离粉碎机', '入侵型室友'],
};

// ─────────── 9宫格词云坐标（1000×1000 画布） ───────────

const GRID_SLOTS = [
  { x: 500, y: 500, size: 50 },  // 中心
  { x: 250, y: 250, size: 33 },  // 左上
  { x: 750, y: 250, size: 35 },  // 右上
  { x: 250, y: 750, size: 30 },  // 左下
  { x: 750, y: 750, size: 32 },  // 右下
  { x: 500, y: 150, size: 22 },  // 正上
  { x: 500, y: 850, size: 24 },  // 正下
  { x: 150, y: 500, size: 20 },  // 正左
  { x: 850, y: 500, size: 25 },  // 正右
];

@Injectable()
export class PersonaService {

  private readonly llmClient = new LLMClient();

  async calculate(answers: Record<string, string>) {
    // ── 1. 计算7维度编码 ──
    const dims = this.calcDimensions(answers);
    const code = dims.join('');

    // ── 2. 生成称号 ──
    const title = this.pickTitle(code);

    // ── 3. 选挚友 ──
    const friendType = this.pickFriendType(dims);
    const friendNick = this.pickFriendNickname(friendType, dims);

    // ── 4. 选9宫格词云 ──
    const wordCloud = this.buildWordCloud(dims);

    // ── 5. LLM 生成深度文案 ──
    const llmResult = await this.generateDeepCopy(dims, title, friendNick);

    return {
      title,
      personality_depth: llmResult.personality_depth,
      friend_profile: {
        nickname: friendNick,
        friend_analysis: llmResult.friend_analysis,
      },
      word_cloud: wordCloud,
    };
  }

  // ─────────── 维度计算 ───────────

  private calcDimensions(answers: Record<string, string>): number[] {
    const dimMap: [number, number][] = [
      [1, 7],   // D1 能量源
      [3, 6],   // D2 认知力
      [4, 15],  // D3 情绪轴
      [9, 12],  // D4 节奏感
      [13, 16], // D5 表达欲
      [10, 14], // D6 成长观
      [2, 8],   // D7 社交界
    ];
    return dimMap.map(([q1, q2]) => {
      const a1 = answers[String(q1)] || 'A';
      const a2 = answers[String(q2)] || 'A';
      const score = (a1 === 'B' ? 1 : 0) + (a2 === 'B' ? 1 : 0);
      return score >= 1 ? 1 : 0;
    });
  }

  // ─────────── 称号 ───────────

  private pickTitle(code: string): string {
    const prefix = code.substring(0, 3);
    const suffix = code.substring(3, 7);
    const group = TITLES[prefix] || ['未知灵魂体'];
    const idx = parseInt(suffix, 2) % group.length;
    return group[idx];
  }

  // ─────────── 挚友 ───────────

  private pickFriendType(dims: number[]): string {
    const [d1, , d3, d4, , d6, d7] = dims;
    const extro = d1 + d4 + d7;
    if (extro >= 2) return 'boundary';
    if (d3 === 0 && d6 === 0) return 'complement';
    if (d3 === 1 && d6 === 1) return 'mirror';
    return 'rhythm';
  }

  private pickFriendNickname(type: string, dims: number[]): string {
    const pool = FRIEND_NICKNAMES[type] || FRIEND_NICKNAMES.complement;
    const hash = dims.reduce((a, b, i) => a + b * (i + 3), 0);
    return pool[hash % pool.length];
  }

  // ─────────── 9宫格词云 ───────────

  private buildWordCloud(dims: number[]): { word: string; x: number; y: number; size: number; desc: string }[] {
    const [d1, d2, d3, d4, d5, d6, d7] = dims;
    const categories: string[] = [];

    // 根据维度倾向分配词库权重
    if (d3 === 0 || d6 === 0) categories.push('healing');
    if (d2 === 1 || d3 === 1) categories.push('rational');
    if (d1 === 1 || d5 === 1 || d7 === 1) categories.push('fun');
    if (d1 === 0 || d5 === 0 || d4 === 0) categories.push('depth');
    if (categories.length < 2) {
      if (d2 === 0) categories.push('healing');
      if (d2 === 1) categories.push('rational');
      if (d4 === 1) categories.push('fun');
      if (d4 === 0) categories.push('depth');
    }

    // 从各类词库取词，确保不重复
    const used = new Set<string>();
    const words: { word: string; desc: string }[] = [];

    for (const cat of categories) {
      const pool = TRAIT_WORDS[cat] || [];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      for (const item of shuffled) {
        if (!used.has(item.word) && words.length < 9) {
          used.add(item.word);
          words.push(item);
        }
      }
    }

    // 映射到九宫格坐标，添加 ±30px 随机偏移
    return words.map((w, i) => {
      const slot = GRID_SLOTS[i] || GRID_SLOTS[0];
      return {
        word: w.word,
        desc: w.desc,
        x: slot.x + Math.floor(Math.random() * 61) - 30,
        y: slot.y + Math.floor(Math.random() * 61) - 30,
        size: slot.size,
      };
    });
  }

  // ─────────── LLM 深度文案生成 ───────────

  private async generateDeepCopy(
    dims: number[],
    title: string,
    friendNick: string,
  ): Promise<{ personality_depth: string; friend_analysis: string }> {

    const [d1, d2, d3, d4, d5, d6, d7] = dims;
    const isLight = (d1 + d4 + d5 + d7) >= 2;

    const personalityHints = [
      `能量模式：${d1 === 0 ? '向内充电型，社交后需要独处恢复' : '向外供能型，在人群中反而充电'}`,
      `认知方式：${d2 === 0 ? '直觉驱动，先感后想' : '逻辑优先，先想后感'}`,
      `情绪反应：${d3 === 0 ? '共情优先，先接住情绪再处理' : '方案优先，先解决问题再消化感受'}`,
      `节奏偏好：${d4 === 0 ? '慢节奏沉淀，需要时间才能进入状态' : '快节奏冲刺，短时间爆发力强'}`,
      `表达倾向：${d5 === 0 ? '留白型，不太主动倾诉' : '倾诉型，需要被听到'}`,
      `成长观：${d6 === 0 ? '需要被温柔托底才敢迈步' : '需要被推一把才愿意突破'}`,
      `社交边界：${d7 === 0 ? '独立型，需要自己的空间' : '融合型，需要深度连接'}`,
    ].join('；');

    const styleGuide = isLight
      ? '语调可以带点不正经和玩梗，像损友之间的真话，但内核必须是犀利准确的心理学分析。'
      : '语调冷峻克制，像心理医生写下诊断，句句到肉但不煽情。';

    const prompt = `你是一位言辞冷峻、直觉极强的心理分析专家。

用户的性格定性称号：「${title}」
TA的灵魂挚友称号：「${friendNick}」

基于16道心理情景题的7维分析数据：
${personalityHints}

请严格按以下要求产出JSON（不要输出任何JSON之外的内容）：

{
  "personality_depth": "从心理学底层出发，剖析该用户的能量运作模式、核心防御机制，戳破其追求和谐的社会化伪装。探讨TA在精密计算的轨道上产生的精神内耗，并在段落后半部分直接点破TA在循规蹈矩的生活里真正渴望、却从未向外界坦白的"越轨"期待或释放需求。全篇使用冷峻干货分析，严禁出现任何题目中的具体意象（如木门、雨、火炉等）。严格控制在180字左右。",
  "friend_analysis": "阐述这个朋友为什么能成为TA的救赎。分析TA拥有哪些用户不敢外露的勇气和野性，如何替用户撕下面具，在心理上补全其缺失的生命力或攻击性。在段落结尾，用克制高级的文笔描述一个能体现这种补全感、让用户彻底松弛的相处瞬间（体现"只要和TA在一起，离经叛道也理所当然"）。严禁出现任何题目中的具体意象。严格控制在180字左右。"
}

${styleGuide}

重要：只输出JSON，不要有任何其他文字。`;

    // ── 带超时的 LLM 调用（8秒超时） ──
    const llmTimeout = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('LLM_TIMEOUT')), 8000),
    );

    try {
      console.log('[PersonaService] LLM invoke START, title:', title);
      const res = await Promise.race([
        this.llmClient.invoke(
          [{ role: 'user', content: prompt }],
          { model: 'doubao-seed-2-0-mini-260215', temperature: 0.9 },
        ),
        llmTimeout,
      ]);

      if (!res) {
        console.log('[PersonaService] LLM timeout, using fallback');
        return this.buildFallback(dims, title, friendNick, isLight);
      }

      const raw = (res as any).content || '';
      console.log('[PersonaService] LLM raw response length:', raw.length);

      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.personality_depth && parsed.friend_analysis) {
          return {
            personality_depth: parsed.personality_depth,
            friend_analysis: parsed.friend_analysis,
          };
        }
      }
      console.log('[PersonaService] LLM JSON parse failed, using fallback');
    } catch (e) {
      console.log('[PersonaService] LLM error:', (e as Error).message, ', using fallback');
    }

    return this.buildFallback(dims, title, friendNick, isLight);
  }

  // ─────────── 按维度差异化的 Fallback 文案 ───────────

  private buildFallback(
    dims: number[],
    title: string,
    friendNick: string,
    isLight: boolean,
  ): { personality_depth: string; friend_analysis: string } {
    const [d1, d2, d3, d4, d5, d6, d7] = dims;

    // 能量模式
    const energyPart = d1 === 0
      ? '你的能量系统在内部闭环运转，每一次对外输出都在暗中消耗储备，社交对你而言从来不是充电而是放电'
      : '你在外部刺激中汲取能量，但真正让你触电的从来不是人群本身，而是那种被看见的瞬间';

    // 防御机制
    const defensePart = d3 === 0
      ? '你习惯用共情化解冲突，但那些你替别人接住的情绪，最终都变成了压在自己胸口的重力'
      : '你习惯用理性拆解情绪，但那些被你快速处理的感受并没有消失，只是在暗处慢慢发酵';

    // 真实渴望
    const desirePart = d5 === 0
      ? '你真正渴望的不是被理解，而是有人能在你不说话的时候，替你把那句话说了'
      : '你真正渴望的不是被倾听，而是在说完所有话之后，还有人愿意留下来';

    // 社交边界
    const boundaryPart = d7 === 0
      ? '你把独立当作护城河，但护城河挖得太深，连想靠近的人也过不来'
      : '你对深度连接有着近乎执念的需求，但越渴望就越害怕那个连接的断裂';

    const personality_depth = isLight
      ? `${title}——${energyPart}。${defensePart}。${boundaryPart}。说白了，你把自己活成了一个精密运转的社交程序，但内心深处那个最真实的你，其实早就想退出群聊了。${desirePart}。`
      : `${title}——${energyPart}。${defensePart}。${boundaryPart}。你把自己包装得滴水不漏，但那些被你压下去的冲动，才是你真正的底色。${desirePart}，哪怕一次也好。`;

    // 挚友补全逻辑
    const friendType = this.pickFriendType(dims);
    const complementMap: Record<string, [string, string]> = {
      complement: [
        'TA身上有你不敢外露的柔软——不是脆弱，而是一种你早就忘记了的无防备的勇气',
        '你们挤在沙发上刷手机，谁也不说话，但你知道有人接住了你所有没说出口的疲惫',
      ],
      mirror: [
        'TA跟你是一枚硬币的两面，你的克制对应TA的释放，你们互为对方没活出来的那个版本',
        '你们在深夜的便利店门口坐着，TA忽然说了句你一直不敢说的话，你笑了一下，觉得活着好像没那么累',
      ],
      rhythm: [
        'TA能打破你的节奏——不是打扰，而是在你快要沉下去的时候，拽你上来透口气',
        '你原本打算在家宅一天，TA一个电话就让你出了门，回来之后你发现自己竟然笑了',
      ],
      boundary: [
        'TA拥有你压抑已久的那部分攻击性和生命力，你不敢翻的桌TA替你掀',
        '你们在一起的时候，你终于不用扮演那个体面的人，哪怕做点离谱的事也觉得理所当然',
      ],
    };

    const [whyPart, scenePart] = complementMap[friendType] || complementMap.complement;

    const friend_analysis = isLight
      ? `${friendNick}——${whyPart}。TA的存在本身就是一记证据：离经叛道并不会天塌下来。${scenePart}。这就是你们之间的默契——不需要解释，不需要汇报，只需要在。`
      : `${friendNick}——${whyPart}。TA替你撕下面具的方式不是鼓励，而是示范。${scenePart}。在TA面前，你的防备毫无用武之地。`;

    return { personality_depth, friend_analysis };
  }
}
