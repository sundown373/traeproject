export type OrderRequirements = {
  minSpeed: number
  minLift: number
  maxWeight: number
  minManeuverability?: number
}

export type OrderRewards = {
  money: number
  researchPoints: number
}

export type DailyOrder = {
  kind: 'daily'
  id: string
  year: number
  title: string
  description: string
  requirements: OrderRequirements
  rewards: OrderRewards
}

export type SpecialOrderDossier = {
  background: string
  geopolitics: string
  frontierTech: string
  frontierAircraft: string
  performance: string
  missionFit: string
}

export type SpecialOrder = {
  kind: 'special'
  id: string
  year: number
  title: string
  description: string
  requirements: OrderRequirements
  rewards: OrderRewards
  dossier: SpecialOrderDossier
}

export type GameOrder = DailyOrder | SpecialOrder

const dailyId = (year: number, seed: number) => `daily_${year}_${seed}`

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const seeded = (n: number) => {
  let x = n | 0
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return (x >>> 0) / 4294967296
}

export const createDailyOrder = (year: number, seed: number): DailyOrder => {
  const r = seeded(year * 997 + seed * 131)
  const stage = clamp(Math.floor((year - 1903) / 12), 0, 10)

  const baseSpeed = 35 + stage * 18 + Math.floor(r * 10)
  const baseLift = 45 + stage * 12 + Math.floor(r * 8)
  const baseWeight = 120 + stage * 45 + Math.floor(r * 20)

  const titles = [
    '训练飞行与巡航验证',
    '短途邮政航线运力补充',
    '民用展示飞行合同',
    '边境巡逻与侦察值班',
    '航线可靠性评估委托'
  ]
  const descs = [
    '客户需要一架可靠的飞机进行例行飞行与数据记录，要求不要太冒险。',
    '一条短途航线需要更稳定的运力，优先保证起降与维护便利。',
    '主办方希望你提供一架可用于展示的机型：安全、稳定、有体面数据。',
    '例行巡逻任务：不追求极限，但要按时完成、按流程返航。',
    '航空公司希望验证新机型的可靠性与经济性，先用较低指标做入门测试。'
  ]

  return {
    kind: 'daily',
    id: dailyId(year, seed),
    year,
    title: titles[Math.floor(r * titles.length)],
    description: descs[Math.floor(r * descs.length)],
    requirements: {
      minSpeed: clamp(baseSpeed, 40, 320),
      minLift: clamp(baseLift, 45, 260),
      maxWeight: clamp(baseWeight, 120, 900)
    },
    rewards: {
      money: 1200 + stage * 720,
      researchPoints: 220 + stage * 160
    }
  }
}

export const SPECIAL_ORDERS: SpecialOrder[] = [
  {
    kind: 'special',
    id: 'special_1903',
    year: 1903,
    title: '基蒂霍克：第一次可控动力飞行',
    description: '你资助的团队即将进行最后一次试飞。军方与媒体都在观望：这会是奇迹，还是又一次“滑翔失败”？',
    requirements: { minSpeed: 35, minLift: 50, maxWeight: 120 },
    rewards: { money: 1200, researchPoints: 260 },
    dossier: {
      background:
        '1903年，航空仍是“滑翔器与梦想”的时代。真正的难点不是离地，而是：持续、可控、可重复。\n\n你需要交付一架“能按指令转弯并稳定着陆”的飞行器，才能把实验从一次性演示变成可复制的工程方案。',
      geopolitics:
        '当时各国军方都把飞机当成潜在的侦察工具，但并未形成成熟预算。\n\n一旦你证明“可控飞行”，后续的军用合同、训练体系与制造标准会快速涌入，航空将从民间实验转为国家竞争的技术赛道。',
      frontierTech:
        '前沿并不在“更大马力”，而在系统工程：\n- 轻量结构（木材/帆布/拉线）\n- 控制机构（俯仰/横滚/偏航）\n- 数据驱动的翼型与升阻理解（风洞与实验记录）\n\n这是航空最早的“科技树”：每一条数据曲线都等价于一次时代跃迁。',
      frontierAircraft:
        '同一时期的“前沿飞机”更多是各种滑翔器与早期动力实验：它们可能能离地，但很难把“控制”做成可复制流程。\n\n真正的分水岭是：你能否把飞行变成一种“可教学、可训练”的技能，而不是一次性运气。',
      performance:
        '指标解释：\n- 速度：确保离地与基本巡航的动力余量。\n- 升力：决定起飞与可载荷（哪怕只是控制系统）。\n- 重量上限：在早期轻量材料下，重量是硬约束。\n\n提示：低级别机型的“速度/升力”是用来表达工程取舍，不对应精确现实数值。',
      missionFit:
        '胜任任务的关键不是“跑得快”，而是“可控”。\n\n如果你能在满足基础速度/升力的同时把重量压住，就等于证明该设计具有工程可复制性：这将解锁后续军方采购与民间市场。'
    }
  },
  {
    kind: 'special',
    id: 'special_1909',
    year: 1909,
    title: '跨越英吉利海峡：从表演到战略',
    description: '一次短暂的跨海飞行将改变欧洲军方对飞机的看法。你要交付一架能在海风与不确定天气中完成航程的机型。',
    requirements: { minSpeed: 55, minLift: 55, maxWeight: 160 },
    rewards: { money: 2400, researchPoints: 480 },
    dossier: {
      background:
        '1909年的跨海飞行是航空史的“媒体爆点”。它向世界证明：海峡不再是天然防线。\n\n你需要交付一架更可靠的单翼/动力组合，让飞行从短途展示走向跨地域航线。',
      geopolitics:
        '英国、法国、德国都意识到：未来的侦察与通信不再受地形限制。\n\n这会直接推动军方采购、飞行学校、机场与导航设施建设，航空工业开始以国家战略方式组织。',
      frontierTech:
        '关键技术演进：\n- 单翼结构（阻力更低但更吃结构强度）\n- 更可靠发动机（持续功率与散热/润滑）\n- 更合理的机体布局（减少外露结构阻力）\n\n这些改进不是飞跃式，而是连续的工程迭代。',
      frontierAircraft:
        '同代前沿机型以轻量单翼为主，同时也存在大量“靠勇气飞”的改装机。\n\n你交付的设计应体现“可重复的可靠性”，而不是一次性的极限表演。',
      performance:
        '指标解释：\n- 速度：对抗海风与保持航向的余量。\n- 升力：容纳燃油/结构加强带来的重量。\n- 重量上限：防止为了“更强结构”把翼载推到失控。\n\n你可以通过更高效率的机翼/更强动力来提升成功率。',
      missionFit:
        '胜任任务意味着：在不确定天气下仍具备足够余量。\n\n成功将推动“航线思维”出现：飞机开始被当作交通工具与侦察平台，而不只是展览品。'
    }
  },
  {
    kind: 'special',
    id: 'special_1914',
    year: 1914,
    title: '战争爆发：侦察成为炮兵的眼睛',
    description: '一战爆发后，最先变成战场刚需的不是空战，而是侦察与校射。你要交付一架稳定平台，能带设备并长时间在目标区上空工作。',
    requirements: { minSpeed: 70, minLift: 80, maxWeight: 220 },
    rewards: { money: 4200, researchPoints: 720 },
    dossier: {
      background:
        '战争初期，飞机主要承担侦察与炮兵校射：谁能更早发现敌军部署，谁就能用炮火先打穿防线。\n\n你需要交付一架“稳定、能带设备、能滞空”的平台。',
      geopolitics:
        '战场进入总动员模式后，航空采购不再是零散合同，而是国家级工业动员。\n\n侦察能力会直接影响地面战的节奏，因此军方愿意为“稳定性与任务载荷”付费。',
      frontierTech:
        '前沿方向从“飞得起来”转向“任务系统”：\n- 观察员座位与设备挂点\n- 更稳定的飞行品质\n- 更可靠的动力与维护流程\n\n这标志航空从单机性能走向体系能力。',
      frontierAircraft:
        '同代前沿机型包括各种侦察机与任务机：它们不一定快，但能把情报稳定带回来。\n\n你交付的机型应更像“空中平台”，而不是竞技飞机。',
      performance:
        '指标解释：\n- 速度：用于到达任务区并安全返航。\n- 升力：代表载荷能力（观察员、相机、电台）。\n- 重量上限：防止把平台堆到无法起降。\n\n重点不是极限速度，而是带设备还能飞得稳。',
      missionFit:
        '胜任任务的关键：稳定与载荷。\n\n如果你能把升力与重量控制好，就能进入“任务机”时代，后续会解锁更复杂的武器化与护航需求。'
    }
  },
  {
    kind: 'special',
    id: 'special_1915',
    year: 1915,
    title: '福克灾难：空战体系登场',
    description: '同步射击与战斗机的组合让空战形态骤变。你需要交付一架具备更高机动性与足够速度余量的战斗机平台。',
    requirements: { minSpeed: 95, minLift: 70, maxWeight: 220, minManeuverability: 60 },
    rewards: { money: 5600, researchPoints: 980 },
    dossier: {
      background:
        '当机枪能穿过旋转螺旋桨射击，战斗机从“护航附属”变成独立兵种。\n\n你要交付一架能快速转向、占据射击窗口的机体，空战进入“机动与能量”的时代。',
      geopolitics:
        '技术优势会被迅速放大到战场层面：短期空权会改变侦察与炮兵校射的有效性。\n\n这迫使对手加速研发、加速生产、加速训练，形成技术竞赛的螺旋。',
      frontierTech:
        '关键技术包括：\n- 武器/螺旋桨的系统集成（同步器思想）\n- 更强的发动机与更低阻的机体\n- 机动性：结构承载与操纵系统的共同结果\n\n机动性不免费：它会推高结构载荷与维护难度。',
      frontierAircraft:
        '同代前沿战斗机在“单翼低阻”和“双翼高升力”之间摇摆。\n\n你需要做工程取舍：速度、升力、重量、机动性四者很难同时拉满。',
      performance:
        '指标解释：\n- 机动性：抽象表达转弯/爬升/姿态响应，受机翼、动力与布局共同影响。\n- 速度：决定追击与脱离能力。\n- 升力与重量：决定爬升与武器/燃油余量。\n\n这是一张真正的“工程四象限”。',
      missionFit:
        '胜任任务意味着：能在空中对抗中占据有利窗口。\n\n如果机动性达标，你将解锁更深的战斗机分支；即便失败，历史节点也会推进，代表技术机会窗口会被错过。'
    }
  },
  {
    kind: 'special',
    id: 'special_2005',
    year: 2005,
    title: '超大客机：A380 与枢纽博弈',
    description: '你站在宽体巨无霸的时代门口。问题不再只是“造出来”，而是：这种机型是否能在枢纽体系、机场资源与市场周期中活下去？',
    requirements: { minSpeed: 260, minLift: 240, maxWeight: 900 },
    rewards: { money: 26000, researchPoints: 5200 },
    dossier: {
      background:
        'A380 代表了超大客机路线的顶点：在工程上，它把结构、气动、发动机与系统复杂度推到极致；在商业上，它押注“枢纽—辐射”模型。\n\n你需要交付一套能支撑超大载客量与长航程的方案，并理解其风险：市场与机场生态决定成败。',
      geopolitics:
        '空客是跨国工业协作的象征：多国分段制造、政策支持、供应链协调。\n\n大飞机竞争同时是产业政策竞争：认证、出口、融资、航权与机场标准都会影响交付与运营。',
      frontierTech:
        '前沿技术集中在“效率与可维护性”：\n- 高涵道比涡扇的燃油效率与噪声控制\n- 大展弦比机翼与复杂高升力装置\n- 复合材料/先进合金混用与寿命管理\n\n真正的挑战在系统集成：每个子系统都要兼顾安全、可靠、维护、成本。',
      frontierAircraft:
        '同代前沿机型路线分化：\n- 超大客机（枢纽化、规模经济）\n- 高效率双发宽体（点对点、航线灵活）\n\n市场并非只看“最大”，而是看“网络与成本结构”。',
      performance:
        '指标解释：\n- 速度：在现代民航中更多代表巡航能力与动力效率。\n- 升力：代表重载与起降性能（高升力系统+翼面积+推力储备）。\n- 重量上限：代表结构规模与系统复杂度。\n\n在这一代，性能的真正含义是：可持续运营。',
      missionFit:
        '胜任任务意味着：能在高客流枢纽中高效运转。\n\n你必须在“极限规模化”与“运营韧性”之间做选择：即使你交付成功，也不意味着商业永远成功，这就是航空史的复杂性。'
    }
  }
]
