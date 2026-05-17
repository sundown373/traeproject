export interface Part {
  id: string;
  type: 'wing' | 'engine' | 'body';
  name: string;
  techLevel: number;
  stats: {
    speed: number;
    lift: number;
    weight: number;
    maneuverability?: number; // Added maneuverability for dogfights
  };
  iconType: string;
  description?: string;
}

export interface TechNode {
  id: string;
  part: Part;
  cost: number;
  prerequisites: string[]; // IDs of TechNodes that must be unlocked first
  x: number; // For UI positioning in the tech tree (0-10)
  y: number; // For UI positioning in the tech tree (0-10)
  branch: 'main' | 'scout' | 'fighter' | 'bomber';
}

export interface Order {
  id: string;
  year: number;
  title: string;
  description: string;
  requirements: {
    minSpeed: number;
    minLift: number;
    maxWeight: number;
    minManeuverability?: number;
  };
  rewards: {
    money: number;
    researchPoints: number;
  };
}

export interface HistoricalEasterEgg {
  id: string;
  requiredParts: { wing: string; engine: string; body: string };
  title: string;
  historicalBackground: string;
}

export const INITIAL_PARTS: Part[] = [
  { id: 'wing_wood_basic', type: 'wing', name: '基础木质双翼', techLevel: 1, stats: { speed: 20, lift: 50, weight: 30, maneuverability: 20 }, iconType: 'wind', description: '莱特兄弟时代的原始设计，升力大但阻力极高。' },
  { id: 'engine_12hp', type: 'engine', name: '12马力直列引擎', techLevel: 1, stats: { speed: 30, lift: 0, weight: 20, maneuverability: 0 }, iconType: 'zap', description: '定制的铝制水冷引擎，勉强能让飞机离地。' },
  { id: 'body_canvas', type: 'body', name: '敞开式木布机身', techLevel: 1, stats: { speed: 10, lift: 10, weight: 20, maneuverability: 10 }, iconType: 'box', description: '飞行员趴在机翼上驾驶，毫无防护。' },
];

export const TECH_TREE_NODES: TechNode[] = [
  // --- 时代 1: 先驱者 (1903-1910) ---
  {
    id: 'tech_engine_anzani',
    part: { id: 'engine_anzani_25hp', type: 'engine', name: '安扎尼25马力引擎', techLevel: 1, stats: { speed: 45, lift: 0, weight: 35, maneuverability: 0 }, iconType: 'zap', description: '路易·布莱里奥飞越英吉利海峡时使用的半星型引擎。' },
    cost: 50,
    prerequisites: [], // 基础科技，直接可研
    x: 1, y: 3, branch: 'main'
  },
  {
    id: 'tech_body_monocoque_wood',
    part: { id: 'body_monocoque_wood', type: 'body', name: '木质半硬壳机身', techLevel: 1, stats: { speed: 25, lift: 5, weight: 30, maneuverability: 15 }, iconType: 'box', description: '德佩杜辛赛车使用的流线型机身，大幅减小风阻。' },
    cost: 80,
    prerequisites: ['tech_engine_anzani'],
    x: 2, y: 3, branch: 'main'
  },
  
  // --- 时代 2: 一战初期 (1914-1915) ---
  // 侦察机分支
  {
    id: 'tech_wing_taube',
    part: { id: 'wing_taube', type: 'wing', name: '鸽式单翼', techLevel: 2, stats: { speed: 40, lift: 45, weight: 35, maneuverability: 30 }, iconType: 'wind', description: '仿生学设计的后掠单翼，极其稳定，非常适合侦察。' },
    cost: 150,
    prerequisites: ['tech_body_monocoque_wood'],
    x: 3, y: 1, branch: 'scout'
  },
  {
    id: 'tech_engine_mercedes_d1',
    part: { id: 'engine_mercedes_d1', type: 'engine', name: '梅赛德斯D.I 100马力', techLevel: 2, stats: { speed: 70, lift: 0, weight: 60, maneuverability: -5 }, iconType: 'zap', description: '德国早期的可靠直列六缸水冷引擎。' },
    cost: 200,
    prerequisites: ['tech_wing_taube'],
    x: 4, y: 1, branch: 'scout'
  },

  // 战斗机分支
  {
    id: 'tech_engine_gnome_rotary',
    part: { id: 'engine_gnome_rotary', type: 'engine', name: '格罗姆80马力旋转引擎', techLevel: 2, stats: { speed: 65, lift: 0, weight: 45, maneuverability: 20 }, iconType: 'zap', description: '气缸随螺旋桨一起旋转，冷却极佳，且陀螺效应使飞机转向极快！' },
    cost: 250,
    prerequisites: ['tech_body_monocoque_wood'],
    x: 3, y: 5, branch: 'fighter'
  },
  {
    id: 'tech_wing_fokker_e',
    part: { id: 'wing_fokker_e', type: 'wing', name: '福克E型单翼', techLevel: 2, stats: { speed: 50, lift: 40, weight: 30, maneuverability: 45 }, iconType: 'wind', description: '没有副翼，靠机翼翘曲控制横滚，机动性极强。' },
    cost: 300,
    prerequisites: ['tech_engine_gnome_rotary'],
    x: 4, y: 5, branch: 'fighter'
  },

  // --- 时代 3: 一战中后期 (1916-1918) ---
  // 重型轰炸机分支
  {
    id: 'tech_body_gotha',
    part: { id: 'body_gotha', type: 'body', name: '重型双发机身', techLevel: 3, stats: { speed: 15, lift: 30, weight: 120, maneuverability: -20 }, iconType: 'box', description: '可容纳多名乘员和大量炸弹的庞大身躯。' },
    cost: 400,
    prerequisites: ['tech_engine_mercedes_d1'],
    x: 5, y: 1, branch: 'bomber'
  },
  
  // 狗斗王王牌分支
  {
    id: 'tech_wing_triplane',
    part: { id: 'wing_triplane', type: 'wing', name: '三翼机结构', techLevel: 3, stats: { speed: 40, lift: 80, weight: 45, maneuverability: 80 }, iconType: 'wind', description: '牺牲了速度，换来了无与伦比的爬升率和盘旋能力（如红男爵的座驾）。' },
    cost: 450,
    prerequisites: ['tech_wing_fokker_e'],
    x: 5, y: 5, branch: 'fighter'
  },
  {
    id: 'tech_engine_oberursel',
    part: { id: 'engine_oberursel', type: 'engine', name: '奥伯乌泽尔 110马力', techLevel: 3, stats: { speed: 85, lift: 0, weight: 50, maneuverability: 15 }, iconType: 'zap', description: '一战后期顶级的旋转引擎。' },
    cost: 500,
    prerequisites: ['tech_wing_triplane'],
    x: 6, y: 5, branch: 'fighter'
  },
  {
    id: 'tech_body_spad',
    part: { id: 'body_spad', type: 'body', name: '斯帕德流线机身', techLevel: 3, stats: { speed: 50, lift: 15, weight: 40, maneuverability: 25 }, iconType: 'box', description: '坚固且流线型的机身，适合高速俯冲攻击。' },
    cost: 600,
    prerequisites: ['tech_engine_oberursel'],
    x: 7, y: 5, branch: 'fighter'
  }
];

export const GAME_ORDERS: Order[] = [
  {
    id: 'order_1',
    year: 1908,
    title: '莱特军用飞行器选型',
    description: '美国陆军通信兵兵团需要一架飞机，要求必须能搭载两名乘员，且速度过关。',
    requirements: { minSpeed: 55, minLift: 60, maxWeight: 90 },
    rewards: { money: 1200, researchPoints: 150 }
  },
  {
    id: 'order_2',
    year: 1909,
    title: '飞越英吉利海峡',
    description: '《每日邮报》悬赏1000英镑，奖励首个飞越英吉利海峡的飞行员。我们需要稳定的引擎和轻巧的机身！',
    requirements: { minSpeed: 60, minLift: 55, maxWeight: 85 },
    rewards: { money: 2000, researchPoints: 250 }
  },
  {
    id: 'order_3',
    year: 1914,
    title: '马恩河战役侦察',
    description: '战争爆发！我们需要一架能在敌军阵地上空长时间稳定盘旋的侦察机，不需要太灵活，但要稳定飞得高。',
    requirements: { minSpeed: 80, minLift: 90, maxWeight: 120 },
    rewards: { money: 4000, researchPoints: 400 }
  },
  {
    id: 'order_4',
    year: 1915,
    title: '福克灾难：前线制空权',
    description: '敌方的侦察机太嚣张了！我们需要一架机动性极强、且能装载射击同步器的单翼战斗机去猎杀他们！',
    requirements: { minSpeed: 100, minLift: 80, maxWeight: 100, minManeuverability: 70 },
    rewards: { money: 6000, researchPoints: 600 }
  },
  {
    id: 'order_5',
    year: 1917,
    title: '血腥四月：终极狗斗',
    description: '天空被鲜血染红。军方要求设计一种拥有绝对爬升率和盘旋能力的终极缠斗机器，哪怕牺牲一点速度！',
    requirements: { minSpeed: 120, minLift: 120, maxWeight: 120, minManeuverability: 120 },
    rewards: { money: 10000, researchPoints: 1000 }
  }
];

export const EASTER_EGGS: HistoricalEasterEgg[] = [
  {
    id: 'wright_flyer',
    requiredParts: { wing: 'wing_wood_basic', engine: 'engine_12hp', body: 'body_canvas' },
    title: '飞行者一号 (1903)',
    historicalBackground: '这是人类历史上第一架成功进行有动力、可控、持续飞行的重于空气的飞行器。它由莱特兄弟设计制造，标志着航空时代的正式开启！'
  },
  {
    id: 'bleriot_xi',
    requiredParts: { wing: 'wing_wood_basic', engine: 'engine_anzani_25hp', body: 'body_monocoque_wood' },
    title: '布莱里奥 XI 型 (1909)',
    historicalBackground: '1909年7月25日，路易·布莱里奥驾驶这架单翼机成功飞越了英吉利海峡，震惊了世界，也向各国军方证明了飞机的战略价值。'
  },
  {
    id: 'etrich_taube',
    requiredParts: { wing: 'wing_taube', engine: 'engine_mercedes_d1', body: 'body_monocoque_wood' },
    title: '埃特里希鸽式单翼机 (1914)',
    historicalBackground: '这是一种在空中极度稳定的侦察机，其机翼形状模仿了赞诺尼亚树种子的飞行形态。它是德国和奥匈帝国在一战初期最主要的侦察力量。'
  },
  {
    id: 'fokker_e_indecker',
    requiredParts: { wing: 'wing_fokker_e', engine: 'engine_gnome_rotary', body: 'body_monocoque_wood' },
    title: '福克 E 型单翼战斗机 (1915)',
    historicalBackground: '这架飞机安装了革命性的“射击同步器”，允许机枪穿过旋转的螺旋桨开火。它在1915年造成了协约国空军的“福克灾难”。'
  },
  {
    id: 'fokker_dr1',
    requiredParts: { wing: 'wing_triplane', engine: 'engine_oberursel', body: 'body_canvas' },
    title: '福克 Dr.I 三翼战斗机 (1917)',
    historicalBackground: '著名的“红男爵”曼弗雷德·冯·里希特霍芬的最爱。三翼设计赋予了它无与伦比的机动性和爬升率，是近距离狗斗的王者。'
  }
];
