/** 16 道情景题目数据 */
export interface QuestionOption {
  key: 'A' | 'B';
  text: string;
  subText: string;
}

export interface Question {
  id: number;
  scenario: string;
  options: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    scenario: '你站在一扇门前',
    options: [
      { key: 'A', text: '推开温暖的木门', subText: '光从缝隙漏出来' },
      { key: 'B', text: '推开厚重的铁门', subText: '传来金属的回响' },
    ],
  },
  {
    id: 2,
    scenario: '迷雾中失去了方向',
    options: [
      { key: 'A', text: '原地等待雾散', subText: '相信方向会找到你' },
      { key: 'B', text: '顺着水流走', subText: '水流知道去哪里' },
    ],
  },
  {
    id: 3,
    scenario: '偶遇一位旅人',
    options: [
      { key: 'A', text: '他告诉你一个秘密', subText: '只有你知道了' },
      { key: 'B', text: '他给你一张地图', subText: '标注了所有路' },
    ],
  },
  {
    id: 4,
    scenario: '突然下起了雨',
    options: [
      { key: 'A', text: '走进雨里慢慢走', subText: '雨水也是风景' },
      { key: 'B', text: '躲进屋檐等雨停', subText: '干燥也是安宁' },
    ],
  },
  {
    id: 5,
    scenario: '收到一份礼物',
    options: [
      { key: 'A', text: '一本泛黄的旧相册', subText: '时光在这里停住' },
      { key: 'B', text: '一台崭新的设备', subText: '未来从这里开始' },
    ],
  },
  {
    id: 6,
    scenario: '你想要一种声音陪伴',
    options: [
      { key: 'A', text: '一首熟悉的老歌', subText: '旋律里有故事' },
      { key: 'B', text: '纯净的白噪音', subText: '安静也是一种陪伴' },
    ],
  },
  {
    id: 7,
    scenario: '你想要什么样的陪伴',
    options: [
      { key: 'A', text: '温暖的火炉', subText: '光和热缓缓包围' },
      { key: 'B', text: '一扇巨大的窗户', subText: '世界在窗外流动' },
    ],
  },
  {
    id: 8,
    scenario: '你要选择一个角色',
    options: [
      { key: 'A', text: '唯一的观众', subText: '安静地看懂一切' },
      { key: 'B', text: '所有人的导演', subText: '让故事发生' },
    ],
  },
  {
    id: 9,
    scenario: '告别的时刻',
    options: [
      { key: 'A', text: '留下一本记事本', subText: '文字替我记住' },
      { key: 'B', text: '设一个闹钟', subText: '时间会叫我回来' },
    ],
  },
  {
    id: 10,
    scenario: '踏上冒险旅途',
    options: [
      { key: 'A', text: '和最懂你的人同行', subText: '默契胜过一切' },
      { key: 'B', text: '和最强的人同行', subText: '挑战使人成长' },
    ],
  },
  {
    id: 11,
    scenario: '选择一种颜色',
    options: [
      { key: 'A', text: '雾霾蓝', subText: '安静的、远的' },
      { key: 'B', text: '落日橘', subText: '温暖的、近的' },
    ],
  },
  {
    id: 12,
    scenario: '偶尔停下来的时候',
    options: [
      { key: 'A', text: '发一会儿呆', subText: '放空是最好的休息' },
      { key: 'B', text: '拥抱身边的人', subText: '温度是最好的充电' },
    ],
  },
  {
    id: 13,
    scenario: '你最喜欢的气味',
    options: [
      { key: 'A', text: '旧书的纸墨香', subText: '岁月沉淀的味道' },
      { key: 'B', text: '刚出炉的面包香', subText: '生活此刻的味道' },
    ],
  },
  {
    id: 14,
    scenario: '仰望星空时',
    options: [
      { key: 'A', text: '觉得自己是一粒尘埃', subText: '渺小而自由' },
      { key: 'B', text: '觉得自己就是星辰', subText: '同样在发光' },
    ],
  },
  {
    id: 15,
    scenario: '有个秘密想倾诉',
    options: [
      { key: 'A', text: '告诉AI', subText: '它不会评判我' },
      { key: 'B', text: '告诉最好的朋友', subText: '它会接住我' },
    ],
  },
  {
    id: 16,
    scenario: '旅途的终点',
    options: [
      { key: 'A', text: '无尽的大海', subText: '永远没有尽头' },
      { key: 'B', text: '自己的家门', subText: '一切从这里开始' },
    ],
  },
];
