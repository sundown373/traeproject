export type PartType = 'wing' | 'engine' | 'body'

export interface Story {
  summary: string
  materials: string
  aerodynamics: string
  business: string
  geopolitics: string
  performance: string
}

export interface Part {
  id: string
  type: PartType
  name: string
  tier: number
  stats: {
    speed: number
    lift: number
    weight: number
    maneuverability: number
  }
  iconType: 'wind' | 'zap' | 'box'
  story: Story
}

export interface ModuleNode {
  id: string
  aircraftId: string
  slot: PartType
  isKey: boolean
  cost: number
  prerequisitesModules: string[]
  part: Part
}

export interface AircraftNode {
  id: string
  name: string
  manufacturer: string
  country: string
  firstFlightYear: number
  tier: number
  era: string
  x: number
  y: number
  cost: number
  prerequisitesAircraft: string[]
  unlockByModules: string[]
  moduleIds: string[]
  successors: string[]
  story: Story
  canonicalBuild: { wing: string; engine: string; body: string }
}

type StoryNotes = {
  summary: string
  materials: string
  aerodynamics: string
  business: string
  geopolitics: string
  performance: string
}

type ModuleMeta = {
  slot: PartType
  name: string
  isKey: boolean
  stats: Part['stats']
  notes: StoryNotes
}

type AircraftMeta = {
  id: string
  name: string
  manufacturer: string
  country: string
  firstFlightYear: number
  tier: number
  era: string
  x: number
  y: number
  cost: number
  prerequisitesAircraft: string[]
  unlockByModules: string[]
  successors: string[]
  notes: StoryNotes
  modules: [ModuleMeta, ModuleMeta, ModuleMeta]
}

const mkStory = (n: StoryNotes): Story => ({
  summary: n.summary,
  materials: n.materials,
  aerodynamics: n.aerodynamics,
  business: n.business,
  geopolitics: n.geopolitics,
  performance: n.performance
})

const mkPart = (id: string, tier: number, slot: PartType, iconType: Part['iconType'], name: string, stats: Part['stats'], notes: StoryNotes): Part => ({
  id,
  type: slot,
  name,
  tier,
  stats,
  iconType,
  story: mkStory(notes)
})

const mkModule = (aircraftId: string, moduleId: string, meta: ModuleMeta, tier: number, costBase: number): ModuleNode => ({
  id: moduleId,
  aircraftId,
  slot: meta.slot,
  isKey: meta.isKey,
  cost: Math.max(0, costBase),
  prerequisitesModules: [],
  part: mkPart(
    moduleId,
    tier,
    meta.slot,
    meta.slot === 'wing' ? 'wind' : meta.slot === 'engine' ? 'zap' : 'box',
    meta.name,
    meta.stats,
    meta.notes
  )
})

const byId = <T extends { id: string }>(arr: T[]): Record<string, T> => Object.fromEntries(arr.map(v => [v.id, v]))

const CORE_AIRCRAFT_META: AircraftMeta[] = [
  {
    id: 'wright_flyer',
    name: '飞行者一号 (Wright Flyer)',
    manufacturer: '莱特兄弟',
    country: '美国',
    firstFlightYear: 1903,
    tier: 1,
    era: '先驱时代',
    x: 1,
    y: 3,
    cost: 0,
    prerequisitesAircraft: [],
    unlockByModules: [],
    successors: ['bleriot_xi'],
    notes: {
      summary:
        '航空史的“点火”时刻：飞行者一号第一次把动力、升力与三轴控制组织成可重复的工程系统，而不是一次性的冒险表演。\n\n' +
        '莱特兄弟在自行车工坊里建立起一整套朴素但严谨的方法：做风洞、量升阻、画数据表、改翼型、再回到外场验证。它的意义不在于飞得多快，而在于证明“控制”可以被设计、被训练、被复制——这让飞机从奇观走向产业。',
      materials:
        '材料体系仍极其原始：云杉/白蜡木梁、帆布蒙皮、钢丝拉线、简易金属连接件，许多部件的制造方式更像木工与车工的混合。\n\n' +
        '真正的工程难点，是在这些“不够强”的材料上建立可靠的受力路径：翼梁如何承载弯矩、拉线如何分担剪力、连接件如何避免松脱与疲劳。飞行者一号让早期航空界第一次意识到，材料的强度并不等于结构的强度，结构设计与制造一致性同样决定安全边界。',
      aerodynamics:
        '气动核心是“把空气当成可测量的对象”。莱特兄弟通过风洞试验修正当时流行的错误数据，重新评估翼型与展弦比，并把控制逻辑写进机体：机翼扭曲负责滚转，前置升降舵负责俯仰，方向舵与滚转耦合用于协调转弯。\n\n' +
        '双翼带来更大翼面积与低速升力，也带来翼间干扰、撑杆与拉线的巨大阻力；这些“代价”解释了为什么后来的机型会不断追求更少的外露结构与更干净的流线。',
      business:
        '飞行者一号的商业价值来自“可证明的能力”：公开演示、军方试验、以及围绕控制系统与机体结构的专利布局。\n\n' +
        '在早期航空市场里，订单并不只买“飞机”，更买“能否稳定复现”的承诺。莱特兄弟的专利诉讼与授权策略一度压制了部分竞争者，也间接推动了其他路线（例如更换操纵方式、改动机翼结构）来绕开专利，这使技术演化从一开始就带着商业博弈的影子。',
      geopolitics:
        '1903 之后，各国军方迅速介入：侦察、通信与炮兵校射被视为改变战争规则的新工具。飞机从实验品变成国家竞争的资源，飞行员训练、机场建设、发动机工厂与后勤体系开始出现。\n\n' +
        '同时，欧洲的技术交流与竞赛推动了“标准化”的萌芽：同样的设计在不同国家被许可生产、被改型、被用于不同任务，航空工业从一开始就具有跨国扩散与本土化改造的双重特征。',
      performance:
        '真实世界：1903 年首飞，单次飞行时间只有十几秒、距离几十米，速度约 50km/h 量级，但其关键指标是“可控”而非“极限”。\n\n' +
        '在本项目的抽象中，它代表基础工程能力：速度与机动都不高，但升力与稳定性为后续机型提供起点。你越早理解“控制与结构”比“堆功率”更重要，后面越不容易在更复杂的订单里翻车。'
    },
    modules: [
      {
        slot: 'wing',
        name: '飞行者一号：木质双翼',
        isKey: true,
        stats: { speed: 15, lift: 55, weight: 35, maneuverability: 15 },
        notes: {
          summary:
            '用木梁与帆布拼出的升力机器：它并不“先进”，却第一次把翼面积、结构受力与操纵机构组合成可重复的飞行平台。\n\n' +
            '双翼的意义在于“把风险压低”：当动力与材料都很弱时，增加翼面积是最直接的起飞方案，而拉线与撑杆则让结构在有限重量下勉强可用。',
          materials:
            '云杉木梁与帆布蒙皮重量轻、加工容易，但受潮、疲劳与局部破损都很常见；连接件多依赖简单金属件与手工装配，一致性高度依赖工匠经验。\n\n' +
            '这类结构的“可维护性”反而很强：在缺乏正规供应链的时代，木布结构可以在野外用补丁式手段快速修复，这也是早期航空能扩散的重要原因。',
          aerodynamics:
            '双翼用翼面积换低速升力，但翼间干扰与支撑线带来巨大阻力；在速度上限不高的年代，这种折中是合理的。\n\n' +
            '更重要的是它承载了早期控制逻辑：机翼扭曲用于滚转，配合方向舵实现协调转弯。你在游戏里把它装上去，看到的不只是升力数值，而是“控制与升力优先”的时代取舍。',
          business:
            '材料与工艺门槛低，使得“可复制”成为可能：演示飞行、训练、以及小批量制造都能快速变现。\n\n' +
            '但低门槛也意味着质量良莠不齐，早期事故往往来自装配一致性不足；这会迫使采购方更看重“能否稳定交付”的制造能力，而不是纸面性能。',
          geopolitics:
            '军方把“升空平台”视为侦察手段后，需求会从“能飞一次”变成“能在规定窗口稳定起飞并返回”。\n\n' +
            '这会推动训练、维修与备件制度化，也推动材料供应与工艺标准化，航空工业的国家化倾向由此开始。',
          performance:
            '真实世界：低速升力强、速度余量极小，对风况与操纵极为敏感。\n\n' +
            '游戏中它作为升力与基础机动的基底，适合完成最早期“证明能飞”的订单，同时为后续单翼、发动机升级与任务化机身奠定起点。'
        }
      },
      {
        slot: 'engine',
        name: '飞行者一号：12马力直列引擎',
        isKey: true,
        stats: { speed: 25, lift: 0, weight: 25, maneuverability: 0 },
        notes: {
          summary:
            '“能用就行”的轻量发动机：功率不大，但重量控制与持续运转能力决定了这台飞机能否离地、能否完成一次完整航段。\n\n' +
            '在早期航空里，发动机不是“可采购的部件”，而是必须自己凑出来的系统工程：材料、加工、冷却、润滑与可靠性缺一不可。',
          materials:
            '早期铸造与加工精度有限，轻量化往往伴随更高的热负荷与更短的寿命；零件间隙、轴承材料、润滑品质都会把失败概率放大。\n\n' +
            '更关键的是“重复性”：当同一台发动机每次输出都不稳定时，飞行测试很难形成可用数据，研发节奏会被拖垮。',
          aerodynamics:
            '推重比决定起飞距离与爬升，而螺旋桨效率则决定功率能否真正转化为推力。低功率迫使机体追求更大翼面积与更低翼载，并把飞行包线锁在温和的速度区间。\n\n' +
            '因此，早期的“动力升级”往往并不是为了极速，而是为了让你在风况、载荷与操纵失误面前多一点余量。',
          business:
            '当供应链不存在时，自研发动机既是成本中心，也是竞争壁垒：谁能稳定造出可用发动机，谁就能更稳定交付合同。\n\n' +
            '随着市场成熟，专业发动机厂出现，整机厂从“全栈自研”转向“集成与适航”，商业分工由此形成。',
          geopolitics:
            '发动机工业能力很快变成国力差距：同样的机翼与机身，只要发动机更可靠、更强劲，就能把航程、载荷与爬升优势放大为战场优势。\n\n' +
            '一战时期，发动机与燃料供应甚至会成为战略瓶颈，决定某条航空路线能否继续推进。',
          performance:
            '真实世界：约 12hp 量级，推力余量极小，对重量与阻力高度敏感。\n\n' +
            '游戏中它是动力路线起点：速度不高，但能为你提供最早期可交付的速度门槛，并为后续“更高功率+更低阻力机体”的组合打开空间。'
        }
      },
      {
        slot: 'body',
        name: '飞行者一号：敞开式木布机身',
        isKey: false,
        stats: { speed: 5, lift: 5, weight: 20, maneuverability: 10 },
        notes: {
          summary:
            '几乎没有“机身”：它更像一副把人、控制拉索与动力系统绑在一起的骨架。对现代眼光而言粗糙、危险，但它让控制机构与结构布置第一次被明确下来。\n\n' +
            '这种“把一切外露”的设计，恰好把早期航空的真实约束展现出来：材料不够、动力不够、工艺不够，只能靠极简与不断试飞去逼近可用。',
          materials:
            '木布结构易修但易燃、耐候性差；连接件多、应力集中点多，任何松动都可能快速演化为失效。\n\n' +
            '优点是可现场维护：在缺乏成熟后勤的年代，结构简单就意味着更高可用性——这也是“先驱时代”的工程现实。',
          aerodynamics:
            '外露拉线、撑杆与设备让阻力巨大，且气流干扰会影响控制面效率；早期对流线与边界层的理解有限，更多依赖经验与试飞修正。\n\n' +
            '它之所以仍能成功，靠的是更大的翼面积与更保守的飞行包线：速度慢，但更容易维持稳定。',
          business:
            '结构简单降低了入行门槛，也导致早期制造商质量良莠不齐：同一张图纸在不同作坊做出来，飞行品质可能完全不同。\n\n' +
            '这会把市场逐步推向“可验证的标准”：检测、试飞流程、训练与维护手册开始出现，航空从手工业向工业体系转变。',
          geopolitics:
            '随着军用介入，标准化与质量控制被迫提升：能否批量生产、能否在野外维护、能否快速训练飞行员，都直接影响军方选型。\n\n' +
            '因此，机身设计很快会从“能装得下人”升级为“能装下任务系统”，这条路线最终会通向封闭座舱、无线电与导航设备的时代。',
          performance:
            '真实世界：航程短、载荷小、对风况极敏感，更多是一台实验与演示机器。\n\n' +
            '游戏中它作为轻量底座，帮助你在早期以更低重量满足起飞与升力门槛，但也会在后续订单里暴露“任务化能力不足”的短板，推动你升级到更成熟的机身平台。'
        }
      }
    ]
  },
  {
    id: 'bleriot_xi',
    name: '布莱里奥 XI 型 (Blériot XI)',
    manufacturer: '布莱里奥',
    country: '法国',
    firstFlightYear: 1909,
    tier: 1,
    era: '先驱时代',
    x: 2,
    y: 3,
    cost: 120,
    prerequisitesAircraft: ['wright_flyer'],
    unlockByModules: ['wright_flyer_engine'],
    successors: ['etrich_taube'],
    notes: {
      summary:
        '1909 年飞越英吉利海峡，使布莱里奥 XI 把飞机从“奇观”推向“可被组织与购买的能力”：它证明了航程、可靠性与任务可达性可以被工程化。\n\n' +
        '从技术谱系上看，它是单翼路线的早期胜利样本：更少的外露结构、更低的干扰阻力，意味着同样功率下能获得更高速度与更远航程。',
      materials:
        '木结构仍主导，但对连接件强度与一致性的要求显著提高：单翼把受力更集中地压在翼梁、撑线与金属接头上，任何局部缺陷都可能造成灾难性失效。\n\n' +
        '这迫使制造从“会做就行”走向“可重复制造”：更好的木材选材、更稳定的胶合与紧固工艺、以及更严格的装配检验，为后续量产与飞行学校训练奠定基础。',
      aerodynamics:
        '单翼降低阻力，让速度与航程显著提升，但也带来更高翼载与更苛刻的配平要求：你必须在升力、结构重量与操纵响应之间做更明确的折中。\n\n' +
        '它的成功说明，航空史上的“进步”往往来自一组连锁变化：阻力更低 → 速度更高 → 航程更远 → 任务半径扩大 → 订单与资金回流更稳定。',
      business:
        '媒体悬赏与展示飞行构成了当时最直接的融资方式：一次成功飞行等同于一场商业发布会，能带来订单、投资与飞行学校的学员。\n\n' +
        '同时，可靠的跨海航段让风险可以被重新定价：保险、票务、培训与维护服务开始出现，飞机作为“产品”而非“表演道具”的商业逻辑逐步成型。',
      geopolitics:
        '英吉利海峡不再是天然屏障，这对欧洲的战略想象造成冲击：侦察、通信与快速投送都开始被认真对待。\n\n' +
        '各国政府与军方迅速加码航空投入，既要买飞机，也要买发动机产能、飞行员训练与机场网络。技术路线的选择因此被地缘需求放大，航空竞赛逐渐升温。',
      performance:
        '真实世界：1909 年飞越英吉利海峡，速度约 70km/h 量级，航程与抗风能力相较先驱机型有质的跃升。\n\n' +
        '游戏中它是单翼路线开端：速度与机动更突出，升力略下降但更“实用”。如果你想尽快完成更苛刻的速度门槛，它往往比继续堆双翼更有效。'
    },
    modules: [
      {
        slot: 'wing',
        name: '布莱里奥 XI：单翼结构',
        isKey: true,
        stats: { speed: 25, lift: 45, weight: 30, maneuverability: 25 },
        notes: {
          summary:
            '单翼减少干扰阻力，是“速度时代”的第一步：它把同样的功率更有效地转化为航速与航程。\n\n' +
            '但单翼也更“挑剔”：受力更集中、操纵更敏感、对制造一致性要求更高，这正是航空从手工走向工业的拐点之一。',
          materials:
            '单翼受力集中，对翼梁、翼肋与金属连接件强度要求更高；拉线与接头的松动会直接改变几何形状并影响操纵。\n\n' +
            '因此材料不只是“够不够强”，还要“够不够一致”：同批次木材的含水率、胶合质量、紧固力矩都会把性能差异放大。',
          aerodynamics:
            '阻力下降带来更高航速，但翼载增加，需要更精细的升阻折中与配平；同时，单翼的失速特性与滚转响应会更敏感。\n\n' +
            '这推动了对翼型、配平与操纵系统的改进，也推动了更系统的训练：更快的飞机不只更强，也更危险。',
          business:
            '速度与航程提升意味着更可售的“产品”：飞行学校扩大、航段表演更稳定、军方测试更积极。\n\n' +
            '单翼路线的成功会吸引资金与人才，但也会带来更高的责任：事故率、维护成本与训练难度会直接反噬市场口碑。',
          geopolitics:
            '跨海峡飞行震动军方，侦察与通信需求制度化后，采购会从“买几架试试”变成“形成编制与训练体系”。\n\n' +
            '单翼在速度与航程上的优势，意味着更大的任务半径与更强的战略机动性，因此更容易获得资源倾斜。',
          performance:
            '真实世界：速度提升明显，航程与任务可达性更强。\n\n' +
            '游戏中它显著提升速度与机动，并作为关键模块打开后续侦察与任务化机型的分支，让你更快接触到一战前后对“可靠平台”的需求。'
        }
      },
      {
        slot: 'engine',
        name: '布莱里奥 XI：25马力级引擎',
        isKey: true,
        stats: { speed: 40, lift: 0, weight: 35, maneuverability: 0 },
        notes: {
          summary:
            '更高功率带来更大速度余量，而跨海峡飞行真正押注的，是发动机在关键时刻“持续输出”的可靠性与可预测性。\n\n' +
            '这类动力升级把航空从“靠运气飞一次”推向“能规划航段”：你可以更明确地估算油量、风况与安全余量。',
          materials:
            '更复杂的机加工与润滑系统提升可靠性上限：轴承材料、加工精度与热处理决定寿命曲线，润滑与冷却决定极限工况。\n\n' +
            '早期发动机的失败往往并非“功率不够”，而是“热崩溃”或“润滑失效”。材料与工艺的进步，把这些失败从常态变成可控的工程风险。',
          aerodynamics:
            '功率提升允许更小阻力机体与更高巡航速度，但油耗与散热成为新约束；同时，螺旋桨匹配开始影响真实推力。\n\n' +
            '这意味着单纯堆功率并不总是赚：如果机体阻力很大，功率会被“浪费”在克服阻力上，表现为速度提升有限但油耗暴涨。',
          business:
            '专业发动机供应链形成后，整机厂可以“买发动机”而非全自研，从而把资源集中在机体与控制上。\n\n' +
            '但供应链也会带来新风险：交付周期、备件可得性与维护网络决定出勤率。发动机从零件变成“服务体系”，商业竞争开始围绕后勤与可靠性展开。',
          geopolitics:
            '发动机工厂成为战略资源：谁能稳定生产与保障燃料，谁就能把飞机从少量奇观变成规模化力量。\n\n' +
            '战争时期，发动机与燃料会被优先保障，甚至影响外交与工业政策，技术路线往往因此被锁定。',
          performance:
            '真实世界：约 20~30hp 量级，可靠性与持续输出能力显著提升。\n\n' +
            '游戏中它显著提升速度，是你从先驱机型迈向更“任务化”的关键台阶：更高速度意味着更大的生存余量与更高的订单完成率。'
        }
      },
      {
        slot: 'body',
        name: '布莱里奥 XI：轻量桁架机身',
        isKey: false,
        stats: { speed: 15, lift: 5, weight: 25, maneuverability: 15 },
        notes: {
          summary:
            '更轻更紧凑的桁架布局，把“能飞”推进到“能飞得远、能按计划飞”：重量下降不仅提升性能，更提升可靠性与安全余量。\n\n' +
            '这类机身是早期航空的典型形态：极简、外露、可修，但开始出现对布局与维护性的系统思考。',
          materials:
            '木桁架+金属接头组合使得受力路径更清晰，但连接件强度与防松措施成为安全关键；同样一根拉线的张力差异，就可能改变操纵手感与结构载荷。\n\n' +
            '材料选择也开始服务“可维护”：更容易更换的接头、更容易检查的关键节点，让训练与运营更可控。',
          aerodynamics:
            '外形仍不流线，但布局收紧减少了外露结构面积，阻力有所下降；同时，重心布置更紧凑，配平更容易。\n\n' +
            '它仍然暴露“外露结构的极限”：当速度再提升时，阻力会指数级变得昂贵，推动后续向更流线、更封闭的机身过渡。',
          business:
            '可复制结构利于批产，训练与表演市场带来持续订单；更轻更易修意味着更高出勤率，这是早期运营最直接的利润来源。\n\n' +
            '但批产也会暴露质量问题：事故与口碑会直接影响招生与订单，因此制造商不得不更重视工艺一致性与交付标准。',
          geopolitics:
            '民间飞行热潮与军用需求交织，推动机场、维修工坊与训练体系萌芽。\n\n' +
            '当国家开始把航空纳入军事与工业规划后，“能训练、能维修、能批量交付”的平台往往比“更快一点的原型机”更有战略价值。',
          performance:
            '真实世界：续航与抗风能力较先驱机型提升，稳定性更好。\n\n' +
            '游戏中它为侦察路线铺路：速度与机动小幅提升、重量控制更好，让你在面对更复杂订单时拥有更高的容错。'
        }
      }
    ]
  },
  {
    id: 'etrich_taube',
    name: '鸽式单翼机 (Etrich Taube)',
    manufacturer: '埃特里希 / 许可生产',
    country: '奥匈/德意志',
    firstFlightYear: 1910,
    tier: 2,
    era: '一战早期',
    x: 3,
    y: 2,
    cost: 180,
    prerequisitesAircraft: ['bleriot_xi'],
    unlockByModules: ['bleriot_xi_wing'],
    successors: ['farman_mf11', 'fokker_e'],
    notes: {
      summary:
        '仿生学思路的稳定平台：鸽式单翼机以“像鸟一样温和、易控”的飞行品质著称，是侦察时代的“空中相机座”。\n\n' +
        '它不追求极限速度，而追求稳定、可预测与更长的任务滞空时间。在航空仍然危险且难以训练的年代，这种“更容易把人带回家”的特性会被军方与运营方直接当作价值。',
      materials:
        '木布仍主导，但翼尖与后缘的复杂曲线使制造一致性更敏感：翼肋形状、蒙皮张力与拉线张力都会改变气动特性，导致“同型号不同架次”飞行品质差异很大。\n\n' +
        '为了维持稳定性，结构往往需要更精细的工艺控制，这也推动了对模板化加工、检验流程与更可靠连接件的需求。',
      aerodynamics:
        '强调稳定与温和失速：仿生外形与较大的翼面积让它在低速时更“愿意飞”，对新手更友好；代价是滚转响应与极速受限。\n\n' +
        '从气动演化角度看，鸽式单翼代表一种“把稳定当成性能”的路线：当任务是观察与记录时，稳定比机动更关键，这一逻辑在侦察机、轰炸机乃至后来的民航机上都会反复出现。',
      business:
        '侦察订单更看重“任务完成率”而非峰值性能：稳定意味着更低事故率、更低训练成本、更高出勤率，最终都能折算为合同与预算。\n\n' +
        '因此制造商卖的不只是机体，而是“可用性”：更容易维护、更容易训练、更容易按时执行任务的整套方案。',
      geopolitics:
        '侦察改变炮兵校射与战场态势，空中情报成为地面战的倍增器。随着侦察制度化，稳定平台的战略价值被持续放大。\n\n' +
        '同时，发动机与材料供应链开始国家化，某一型飞机能否持续服役，越来越取决于工业产能与后勤保障，而不仅是设计本身。',
      performance:
        '真实世界：速度在百公里/小时量级，飞行品质稳定，适合长时间任务。\n\n' +
        '游戏中它以升力与稳定收益更突出：能更可靠地满足“滞空/载荷/任务化”倾向的订单，并作为通往一战任务机与战斗机分支的关键节点。'
    },
    modules: [
      {
        slot: 'wing',
        name: '鸽式单翼：仿生后掠翼',
        isKey: true,
        stats: { speed: 25, lift: 55, weight: 40, maneuverability: 20 },
        notes: {
          summary:
            '仿生“鸽翼”追求稳定与长航时：它把飞行品质做得更温和，让观察、摄影与记录成为可重复的任务流程。\n\n' +
            '这种机翼不是为缠斗设计的，它的价值在于“可预测”——在风况变化与操作误差下仍然容易保持姿态。',
          materials: '更复杂的轮廓意味着更高工艺门槛，结构一致性直接影响飞行品质。',
          aerodynamics: '稳定平台利于摄影与观察，但滚转与高速性能受限。',
          business: '稳定性与可用性让它更容易被军方选型并规模化采购。',
          geopolitics: '侦察任务制度化后，稳定平台的战略价值被放大。',
          performance: '真实世界：稳定、易飞；游戏中提升升力与稳定。'
        }
      },
      {
        slot: 'engine',
        name: '鸽式单翼：早期水冷直列平台',
        isKey: true,
        stats: { speed: 50, lift: 0, weight: 55, maneuverability: 0 },
        notes: {
          summary: '更可靠的直列发动机把侦察从短途冒险推向持续任务。',
          materials: '水冷系统对焊接、管路与散热器材料提出更高要求。',
          aerodynamics: '散热器布置会增加阻力，工程上要在冷却与速度之间折中。',
          business: '可靠性提升意味着更高出勤率，是航空单位运营的核心。',
          geopolitics: '发动机产业链逐渐国家化，成为战略工业。',
          performance: '真实世界：几十到上百马力区间；游戏中提升速度。'
        }
      },
      {
        slot: 'body',
        name: '鸽式单翼：侦察机身与挂点',
        isKey: false,
        stats: { speed: 10, lift: 15, weight: 55, maneuverability: 5 },
        notes: {
          summary: '从“能飞”到“能带设备”：相机、电台与地图桌开始进入飞机。',
          materials: '挂点与舱段加强引入更多金属件，重量上升但任务能力增强。',
          aerodynamics: '外露设备与开口增加阻力，推动后续流线化需求。',
          business: '“可任务化”带来长期改装合同，制造商卖的不只是机体。',
          geopolitics: '情报链条形成后，航空成为地面火力体系的一环。',
          performance: '真实世界：载荷有限但价值极高；游戏中为任务机路线打底。'
        }
      }
    ]
  },

  {
    id: 'farman_mf11',
    name: '法尔曼 MF.11 “短角牛” (Farman MF.11)',
    manufacturer: '法尔曼',
    country: '法国',
    firstFlightYear: 1913,
    tier: 2,
    era: '一战早期',
    x: 4,
    y: 2,
    cost: 220,
    prerequisitesAircraft: ['etrich_taube'],
    unlockByModules: ['etrich_taube_body'],
    successors: ['voisin_iii'],
    notes: {
      summary: '宽翼展双翼的“任务机”：慢，但能带更多设备与载荷。',
      materials: '木布结构冗余提升以应对载荷与战场损伤，连接件与拉线数量暴增。',
      aerodynamics: '高升力、低翼载的代价是巨大阻力；它强调“在空中待得住”。',
      business: '军方为任务能力付费：观察员座位、挂架、照相设备决定合同价值。',
      geopolitics: '一战初期侦察与轻型轰炸快速成型，任务机需求暴涨。',
      performance: '真实世界：速度低但载荷更高；游戏中升力与重量承受显著提升。'
    },
    modules: [
      {
        slot: 'wing',
        name: 'MF.11：宽翼展双翼',
        isKey: true,
        stats: { speed: 20, lift: 75, weight: 55, maneuverability: 10 },
        notes: {
          summary:
            '把升力拉满：用翼面积换取挂载与滞空，让“侦察/投弹/通信”从偶发尝试变成可排班的任务。\n\n' +
            '这类机翼代表一战初期的现实主义：当发动机与材料还不够强时，最可靠的性能提升方式就是更大的翼面积与更保守的翼载。',
          materials: '更多结构件意味着更高制造与维护成本，质量一致性更难。',
          aerodynamics:
            '升力强但阻力大，速度上限受限；同时，多翼结构与拉线带来的干扰会让高速段收益很差。\n\n' +
            '从气动取舍上看，它把“任务可用性”放在“极速”之前：低速稳定、温和失速、能长时间在目标区停留，才是侦察平台的核心。',
          business: '适合“可量化任务”的订单：侦察、投弹、通信。',
          geopolitics:
            '战争需求推动大翼面积平台普及：侦察与校射让前线火力更有效，任务机的出勤率比单机性能更被看重。\n\n' +
            '当任务制度化后，平台会被要求携带相机、无线电、地图桌与挂架，这会进一步反推机翼需要更大升力与更稳的低速性能。',
          performance: '真实世界：低速稳定；游戏中升力显著提升。'
        }
      },
      {
        slot: 'engine',
        name: 'MF.11：百马力级引擎平台',
        isKey: false,
        stats: { speed: 55, lift: 0, weight: 70, maneuverability: -5 },
        notes: {
          summary: '推力主要用来“把载荷抬起来”，而不是追求极速。',
          materials: '热管理与润滑成熟度决定可靠性与寿命。',
          aerodynamics: '推力增长弥补阻力，但无法根本改变高阻特性。',
          business:
            '可靠出勤率比峰值功率更值钱：军方与运营方关心的是“今天能起飞多少架、能完成多少架次”，而不是单次飞行能冲到多少速度。\n\n' +
            '这会把发动机的维护周期、备件可得性与维修人员训练纳入采购决策。发动机从“零件”变成“保障体系”，而保障体系才是任务机规模化的前提。',
          geopolitics: '发动机供应紧张倒逼通用化与替换性。',
          performance: '真实世界：百马力级普及；游戏中作为载荷平台动力。'
        }
      },
      {
        slot: 'body',
        name: 'MF.11：双座观察员舱',
        isKey: true,
        stats: { speed: 10, lift: 25, weight: 80, maneuverability: 0 },
        notes: {
          summary: '观察员、相机、地图与挂架：飞机开始像“任务系统”。',
          materials: '舱段开口与加强结构增加重量，强化连接件与隔框。',
          aerodynamics: '开放座舱阻力大，推动后续封闭座舱与流线化。',
          business: '改装能力带来长期合同，制造商卖“平台+套件”。',
          geopolitics: '侦察—火力校射链路改变地面战。',
          performance: '真实世界：任务能力突出；游戏中解锁轰炸机雏形。'
        }
      }
    ]
  }
  ,
  {
    id: 'voisin_iii',
    name: '沃森 III (Voisin III)',
    manufacturer: '沃森兄弟',
    country: '法国',
    firstFlightYear: 1914,
    tier: 2,
    era: '一战早期',
    x: 5,
    y: 1,
    cost: 260,
    prerequisitesAircraft: ['farman_mf11'],
    unlockByModules: ['farman_mf11_body'],
    successors: ['handley_o400'],
    notes: {
      summary: '早期轰炸机雏形：在低速平台上把“投弹”变成可重复任务。',
      materials: '木布结构承载更大载荷，隔框与挂架加强让重量快速上升。',
      aerodynamics: '高阻力、低速度，但更稳定；适合按航线执行轰炸任务。',
      business: '轰炸任务推动“任务载荷”采购：挂架、瞄准具和维修保障都算成本。',
      geopolitics: '战略轰炸概念开始出现，城市与后方工业进入战争视野。',
      performance: '真实世界：速度不高但能带炸弹；游戏中强调载荷与稳定。'
    },
    modules: [
      {
        slot: 'wing',
        name: 'Voisin III：稳定双翼',
        isKey: true,
        stats: { speed: 15, lift: 80, weight: 70, maneuverability: -5 },
        notes: {
          summary: '为稳定与载荷服务的双翼，强调可重复执行任务。',
          materials: '结构冗余提高抗损性，但制造与维修成本增加。',
          aerodynamics: '升力强、阻力大，适合低速巡航与投弹。',
          business: '稳定意味着更低事故率与更高出勤率，能直接转化为合同。',
          geopolitics: '执行任务能力决定空军在战争体系中的位置。',
          performance: '真实世界：载荷能力提升；游戏中大幅提高升力。'
        }
      },
      {
        slot: 'engine',
        name: 'Voisin III：双发/增强动力配置',
        isKey: true,
        stats: { speed: 60, lift: 0, weight: 90, maneuverability: -10 },
        notes: {
          summary:
            '更大载荷需要更稳的动力与冗余：双发并不只为“更快”，更是为“更可靠”——任何一台发动机状态异常，都不至于立刻失去返航能力。\n\n' +
            '这类配置把轰炸机从“能带炸弹”推进到“能按计划把炸弹送到目标区并返回”，而按计划这件事，本身就是战略能力。',
          materials: '更高功率带来热与振动问题，轴承与润滑品质决定寿命。',
          aerodynamics: '推力主要用于抵消阻力与载荷，而不是极速。',
          business: '冗余动力提高任务可靠性，但燃油与维护成本也随之上升。',
          geopolitics: '后勤能力决定轰炸机是否能规模化使用。',
          performance: '真实世界：任务平台动力；游戏中提高速度上限与承载。'
        }
      },
      {
        slot: 'body',
        name: 'Voisin III：投弹挂架与任务舱',
        isKey: false,
        stats: { speed: 5, lift: 30, weight: 120, maneuverability: -10 },
        notes: {
          summary: '把“炸弹”当成标准载荷：挂架、舱段与瞄准流程开始标准化。',
          materials:
            '挂架与加强结构增加重量，金属件比例提高：承载炸弹的连接点会把冲击载荷、振动与疲劳集中到少数节点上，必须用更可靠的金属件与更清晰的受力路径来消化。\n\n' +
            '这类“任务舱段”的出现也意味着维修复杂度上升：不仅要修机体，还要维护挂架、投放机构与瞄准设备，后勤体系的门槛被抬高。',
          aerodynamics: '外挂载荷增加阻力，促使后续的内置弹舱与流线化探索。',
          business: '武器系统与平台绑定，形成更复杂的采购与升级路径。',
          geopolitics: '战略轰炸推动国家对工业与城市防空的投入。',
          performance: '真实世界：轰炸能力初步成型；游戏中提高重量上限。'
        }
      }
    ]
  },
  {
    id: 'handley_o400',
    name: '汉德利·佩奇 O/400 (Handley Page O/400)',
    manufacturer: 'Handley Page',
    country: '英国',
    firstFlightYear: 1916,
    tier: 3,
    era: '一战中后期',
    x: 6,
    y: 1,
    cost: 420,
    prerequisitesAircraft: ['voisin_iii'],
    unlockByModules: ['voisin_iii_engine'],
    successors: ['junkers_f13'],
    notes: {
      summary: '一战重型轰炸机代表：规模化的载荷、航程与组织能力。',
      materials: '木布结构做到极限，结构加强与产线管理成为工程重点。',
      aerodynamics:
        '高阻力但更远航程，强调“把炸弹送到后方”。它把航空从“前线战术支援”推进到“后方打击与心理震慑”，航程与可靠巡航成为关键。\n\n' +
        '在这种尺度上，气动不再是单点指标，而是系统权衡：更大翼面积提供升力与低速安全边界，更大的机身与载荷又带来阻力与重量，必须用更强动力与更保守的飞行包线去换取可用性。',
      business: '大平台意味着高单位成本，生产组织与供应链比单机性能更关键。',
      geopolitics: '战略轰炸把战争从前线延伸到城市与工业。',
      performance: '真实世界：双发重型轰炸机；游戏中提高重量与航程表征。'
    },
    modules: [
      {
        slot: 'wing',
        name: 'O/400：重载双翼',
        isKey: true,
        stats: { speed: 10, lift: 110, weight: 110, maneuverability: -20 },
        notes: {
          summary: '为载荷而生的大翼：升力与结构冗余堆到极致。',
          materials: '拉线与梁架数量巨大，疲劳与一致性是灾难源。',
          aerodynamics:
            '升力强但阻力大，速度不是目标：它追求的是在更高重量下仍能安全起降，并在夜航或恶劣天气里保持可控。\n\n' +
            '从气动角度看，这是一种把“飞行包线”做宽的设计：更大翼面积让失速速度下降，提高任务安全边界；代价是巡航效率变差、对动力与燃料更苛刻。',
          business: '维护成本高，必须靠组织化后勤与机组训练消化。',
          geopolitics: '轰炸任务推动国家资源集中在少数大平台上。',
          performance: '真实世界：载荷显著提升；游戏中极高升力与重量。'
        }
      },
      {
        slot: 'engine',
        name: 'O/400：双发可靠动力',
        isKey: true,
        stats: { speed: 80, lift: 0, weight: 130, maneuverability: -15 },
        notes: {
          summary: '双发提高冗余与任务半径，可靠性比峰值更重要。',
          materials:
            '更大功率对冶金与散热提出更高要求：曲轴、连杆、阀系与轴承材料必须更耐热、更耐疲劳，制造公差也必须更稳定。\n\n' +
            '当发动机进入“重载长航程”工况后，材料的意义会从“能不能跑”变成“能不能在规定维护周期内持续跑”，这直接决定机队规模与出勤率。',
          aerodynamics:
            '推力用于克服阻力与载荷，并改善爬升与巡航余量；对重型平台而言，余量意味着更高安全边界：能在风况变化时保持高度、能在导航误差下多飞一段、能在单台状态异常时不立刻坠落。\n\n' +
            '因此你会看到它的速度提升并不“夸张”，但它让整个任务平台变得更可靠。',
          business: '发动机出勤率决定飞机出勤率，维护体系是“隐形性能”。',
          geopolitics: '工业能力决定发动机供给，进而决定轰炸规模。',
          performance: '真实世界：任务动力平台；游戏中提升速度上限与承载。'
        }
      },
      {
        slot: 'body',
        name: 'O/400：长航程机身与机组布局',
        isKey: false,
        stats: { speed: 5, lift: 35, weight: 180, maneuverability: -20 },
        notes: {
          summary: '多机组与长航程：导航、通信与组织能力成为核心。',
          materials: '更复杂的舱段结构带来重量与维护压力。',
          aerodynamics: '更大机身增加阻力，迫使动力与翼面积同步增长。',
          business: '训练与维护体系成本巨大，形成军用航空的组织化门槛。',
          geopolitics: '长航程轰炸影响城市防空与战略布局。',
          performance: '真实世界：航程与载荷提高；游戏中体现为重量与升力。'
        }
      }
    ]
  },
  {
    id: 'junkers_f13',
    name: '容克 F.13 (Junkers F.13)',
    manufacturer: 'Junkers',
    country: '德国',
    firstFlightYear: 1919,
    tier: 4,
    era: '两战之间',
    x: 7,
    y: 3,
    cost: 650,
    prerequisitesAircraft: ['handley_o400'],
    unlockByModules: ['handley_o400_wing'],
    successors: ['ford_trimotor', 'boeing_247'],
    notes: {
      summary: '全金属客机先驱：把材料学优势转化为商业航线的可靠性。',
      materials: '波纹金属蒙皮与金属结构把耐久性、维护性与一致性提升到新层级。',
      aerodynamics: '波纹蒙皮牺牲一些阻力换取结构强度与制造可行性。',
      business: '更可靠的机体让定期航班成为可能，保险与运营模型开始成型。',
      geopolitics: '战后限制与重建促使技术转向民用，民航网络成为国家形象与经济工具。',
      performance:
        '真实世界：1919 年首飞，是早期民航中“可长期运营”的里程碑机型之一；其价值不在极限速度，而在于把耐久性、维护性与一致性拉到一个新水平。\n\n' +
        '游戏中它代表“全金属化转折点”：同样的速度/载荷数值背后，意味着更稳定的机队运营与更低的事故概率。你会更频繁地看到订单开始强调“可靠交付”和“可持续运营”，这正是民航时代与军用试验时代的分野。'
    },
    modules: [
      {
        slot: 'wing',
        name: 'F.13：全金属波纹机翼',
        isKey: true,
        stats: { speed: 55, lift: 60, weight: 90, maneuverability: 10 },
        notes: {
          summary: '金属翼让结构强度与一致性大幅提升，飞行品质更可预测。',
          materials: '铝合金与铆接工艺成为核心，疲劳与腐蚀开始进入工程管理。',
          aerodynamics: '波纹增加阻力，但强度收益显著，适合当时制造水平。',
          business: '更耐用意味着更长寿命与更低停场率，直接改善运营收益。',
          geopolitics: '工业能力通过民航产品输出，形成新的软实力。',
          performance: '真实世界：可靠性优势明显；游戏中速度与重量承受提升。'
        }
      },
      {
        slot: 'engine',
        name: 'F.13：民航化活塞动力',
        isKey: true,
        stats: { speed: 85, lift: 0, weight: 110, maneuverability: 0 },
        notes: {
          summary: '民航要的是高出勤率：功率之外，维护周期和油耗同样重要。',
          materials: '冶金与加工精度提升带来更稳定的寿命曲线。',
          aerodynamics: '动力储备让航线更可靠，抗风能力更强。',
          business: '可靠性可以写进合同与保险条款，变成可定价的指标。',
          geopolitics: '民航网络扩大推动机场与导航设施建设。',
          performance: '真实世界：用于短途航线；游戏中提升稳定赚钱能力。'
        }
      },
      {
        slot: 'body',
        name: 'F.13：封闭客舱机身',
        isKey: false,
        stats: { speed: 30, lift: 15, weight: 140, maneuverability: 0 },
        notes: {
          summary: '封闭客舱把飞行体验从“冒险”变成“交通”。',
          materials: '金属壳体更适合承受长期振动与环境侵蚀。',
          aerodynamics: '更平滑的机身轮廓降低阻力，并为未来加压铺路。',
          business: '舒适性与安全感提升带来更稳定的需求。',
          geopolitics: '民航连接城市与边疆，成为国家治理与经济一体化工具。',
          performance: '真实世界：可载少量乘客；游戏中提升速度与载荷。'
        }
      }
    ]
  }
]

type GenAircraft = {
  id: string
  name: string
  manufacturer: string
  country: string
  firstFlightYear: number
  tier: number
  era: string
  x: number
  y: number
  cost: number
  prerequisitesAircraft: string[]
  unlockByModules: string[]
  successors: string[]
  highlights: {
    materials: string
    aerodynamics: string
    business: string
    geopolitics: string
    performance: string
  }
}

const genAircraftNotes = (g: GenAircraft): StoryNotes => ({
  summary:
    `“${g.name}”是一个典型的时代样本：它不是凭空飞跃出来的“神机”，而是上一代平台在结构、动力、气动与运营现实中不断修正后的结果。\n\n` +
    `在这条路线里，${g.highlights.aerodynamics}，同时又必须面对材料寿命、维护体系与市场窗口期。理解它的意义，是理解航空史为何总在“技术可能”与“商业可行”之间摇摆。`,
  materials:
    `材料学主线：${g.highlights.materials}。\n\n` +
    `在航空工程里，材料并不只是“更强更轻”四个字：它决定疲劳裂纹如何增长、腐蚀如何扩散、维修是否能在航线节奏中完成、以及零件能否被稳定地批量制造。` +
    `当材料体系变化时（例如从木布到铝合金、再到复合材料），制造工艺、检测方法、供应链与适航认证都会被迫重写，这也是技术迭代往往“慢但不可逆”的原因。`,
  aerodynamics:
    `空气动力学主线：${g.highlights.aerodynamics}。\n\n` +
    `气动设计从来不是追求某一个指标，而是把升力、阻力、稳定性与操纵响应拼成一张“约束网”。` +
    `更高巡航效率往往意味着更高翼载与更复杂的高升力装置；更低阻力的外形又可能带来更苛刻的制造精度需求。` +
    `因此，同一代机型之间的差异，常常体现在“怎么做取舍”，而不是“谁更强”。`,
  business:
    `商业博弈主线：${g.highlights.business}。\n\n` +
    `飞机的成功与否往往发生在图纸之外：航空公司关心的是全生命周期成本（燃油、维护、备件、培训、周转率、停场损失），而制造商关心的是产能爬坡、供应链稳定与售后网络。` +
    `市场还会被周期性事件改写：燃油价格、法规变化、航线网络调整、甚至一次重大事故都会改变采购决策。` +
    `所以，很多“技术更先进”的机型也可能输给“更适合当下运营”的机型。`,
  geopolitics:
    `地缘政治主线：${g.highlights.geopolitics}。\n\n` +
    `航空工业天然跨国：发动机、航电、材料、软件与认证体系往往分布在不同国家与公司。` +
    `在和平时期，这带来效率；在紧张时期，出口管制、制裁、认证互认与金融支持就会直接影响交付与运营。` +
    `因此，一条技术路线能否延续，很多时候取决于产业政策与国际关系，而不是纯粹的工程能力。`,
  performance:
    `性能解读：${g.highlights.performance}。\n\n` +
    `本项目中的数值用于教学抽象：速度代表巡航与动力余量，升力代表载荷与起降能力，重量代表结构规模与系统复杂度，机动性代表响应与战术/运营适配。` +
    `当你把不同模块装配在一起时，你看到的不是“堆数值”，而是一个时代的工程逻辑：它为何能胜任某类任务、又为何在下一代被新的约束击败。`
})

const genModuleNotes = (aircraftName: string, slotLabel: string, focus: string): StoryNotes => ({
  summary:
    `${aircraftName} 的${slotLabel}模块是一组“把工程理念落到零件上”的选择：${focus}。\n\n` +
    `你研发它并装配到车间时，实际上是在复刻该时代的取舍：为什么要这样设计、它解决了什么问题、又引入了哪些新的限制。`,
  materials:
    `材料学视角：${slotLabel}的关键不只在强度，还在疲劳、腐蚀、热管理与可修复性。\n\n` +
    `同一项指标（例如更轻）可能带来一串连锁反应：连接方式变化、检测方法变化、维护周期变化、甚至备件供应方式变化。` +
    `在航空史里，材料升级往往意味着“成本结构升级”，而不仅是性能提升。当前模块的主线是：${focus}。`,
  aerodynamics:
    `气动视角：${slotLabel}直接影响升阻比、稳定性与操纵响应。\n\n` +
    `当你追求更高速度，你往往需要更低阻力外形与更高翼载；但翼载提高又会让起降更难，于是必须引入高升力装置、推力储备或更复杂的控制系统。` +
    `这就是航空工程的互相牵制：${focus}。`,
  business:
    `商业视角：航空公司买的不只是性能，更是可运营性。\n\n` +
    `该${slotLabel}会影响燃油、维护、训练与停场损失。即使纸面性能更好，如果维护成本更高、备件更难、可靠性更差，也可能在市场上失败。` +
    `因此，模块研发的价值在于把“长期成本”做成可控：${focus}。`,
  geopolitics:
    `地缘视角：${slotLabel}技术常常受认证、供应链与出口管制影响。\n\n` +
    `当某个关键部件需要跨国供应时，政策与关系会改变交付速度与成本；在战时或紧张时期，供应链中断甚至会逼迫技术路线回退或改型。` +
    `所以，这个模块不仅是工程选择，也是产业选择：${focus}。`,
  performance:
    `性能视角：本项目的数值用于表达边际贡献。\n\n` +
    `速度反映巡航/动力余量，升力反映载荷与低速能力，重量反映结构规模与系统复杂度，机动性反映响应与适配性。` +
    `当你选择该模块时，你是在用一组数值交换另一组数值：${focus}。`
})

const genStats = (tier: number, slot: PartType): Part['stats'] => {
  const baseSpeed = 10 + tier * 14
  const baseLift = 35 + tier * 10
  const baseWeight = 25 + tier * 22
  const baseMan = 10 + tier * 4
  if (slot === 'engine') return { speed: baseSpeed + 20, lift: 0, weight: baseWeight + 15, maneuverability: 0 }
  if (slot === 'wing') return { speed: Math.max(0, baseSpeed - 5), lift: baseLift + 15, weight: baseWeight + 5, maneuverability: baseMan + 10 }
  return { speed: Math.max(0, baseSpeed - 15), lift: Math.max(0, Math.floor(baseLift * 0.35)), weight: baseWeight + 35, maneuverability: Math.max(-10, baseMan - 15) }
}

const genAircraftMeta = (g: GenAircraft): AircraftMeta => ({
  id: g.id,
  name: g.name,
  manufacturer: g.manufacturer,
  country: g.country,
  firstFlightYear: g.firstFlightYear,
  tier: g.tier,
  era: g.era,
  x: g.x,
  y: g.y,
  cost: g.cost,
  prerequisitesAircraft: g.prerequisitesAircraft,
  unlockByModules: g.unlockByModules,
  successors: g.successors,
  notes: genAircraftNotes(g),
  modules: [
    {
      slot: 'wing',
      name: `${g.name}：机翼体系`,
      isKey: true,
      stats: genStats(g.tier, 'wing'),
      notes: genModuleNotes(g.name, '机翼', g.highlights.aerodynamics)
    },
    {
      slot: 'engine',
      name: `${g.name}：动力体系`,
      isKey: true,
      stats: genStats(g.tier, 'engine'),
      notes: genModuleNotes(g.name, '动力', g.highlights.performance)
    },
    {
      slot: 'body',
      name: `${g.name}：机身结构`,
      isKey: false,
      stats: genStats(g.tier, 'body'),
      notes: genModuleNotes(g.name, '机身', g.highlights.materials)
    }
  ]
})

const GENERATED_AIRCRAFT: GenAircraft[] = [
  {
    id: 'ford_trimotor',
    name: '福特 三发 (Ford Trimotor)',
    manufacturer: 'Ford',
    country: '美国',
    firstFlightYear: 1926,
    tier: 4,
    era: '两战之间',
    x: 8,
    y: 3,
    cost: 720,
    prerequisitesAircraft: ['junkers_f13'],
    unlockByModules: ['junkers_f13_body'],
    successors: ['boeing_247'],
    highlights: {
      materials: '金属结构走向可批量制造与可维护性优先',
      aerodynamics: '以可靠与短场适应为主，效率并非极致',
      business: '航空公司需要“能天天飞”的机器来开通航线',
      geopolitics: '民航网络扩张与机场建设同步推进',
      performance: '三发提高冗余与信心，速度与航程进入可运营区间'
    }
  },
  {
    id: 'boeing_247',
    name: '波音 247',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 1933,
    tier: 5,
    era: '商业航空崛起',
    x: 9,
    y: 3,
    cost: 900,
    prerequisitesAircraft: ['ford_trimotor'],
    unlockByModules: ['ford_trimotor_engine'],
    successors: ['dc3'],
    highlights: {
      materials: '半硬壳与系统工程让可靠性可被流程化管理',
      aerodynamics: '低翼与收放起落架显著降低阻力',
      business: '速度与出勤率决定航线利润，运营模型走向现代化',
      geopolitics: '航空工业与航空公司绑定更紧，供应链成为优势',
      performance: '巡航速度与舒适性显著提升，成为早期现代客机代表'
    }
  },
  {
    id: 'lockheed_constellation',
    name: '洛克希德 星座 (L-049 Constellation)',
    manufacturer: 'Lockheed',
    country: '美国',
    firstFlightYear: 1943,
    tier: 6,
    era: '战后远程客运',
    x: 10,
    y: 3,
    cost: 1200,
    prerequisitesAircraft: ['dc3'],
    unlockByModules: ['dc3_wing', 'dc3_engine'],
    successors: ['dehavilland_comet'],
    highlights: {
      materials: '结构强度与系统复杂度提升，维护体系更专业化',
      aerodynamics: '更流线的机体与更高巡航效率支撑跨洲航线',
      business: '长途航线把准点率与客舱体验变成核心竞争力',
      geopolitics: '全球航线网络与战后秩序、机场体系共同成长',
      performance: '远程高速活塞时代巅峰之一，航程与速度大幅提升'
    }
  },
  {
    id: 'dehavilland_comet',
    name: '德哈维兰 彗星 (de Havilland Comet)',
    manufacturer: 'de Havilland',
    country: '英国',
    firstFlightYear: 1949,
    tier: 7,
    era: '喷气时代',
    x: 11,
    y: 2,
    cost: 1450,
    prerequisitesAircraft: ['lockheed_constellation'],
    unlockByModules: ['lockheed_constellation_body'],
    successors: ['boeing_707', 'tu104'],
    highlights: {
      materials: '加压机身疲劳与金属疲劳教训推动结构安全工程',
      aerodynamics: '喷气巡航提升速度，但高空与加压带来新问题',
      business: '更快的航程缩短改变需求结构，但事故会摧毁信任',
      geopolitics: '国家工业形象与认证体系影响市场接受度',
      performance: '早期喷气客机，速度跨越式提升，也暴露疲劳与安全难题'
    }
  },
  {
    id: 'tu104',
    name: '图-104 (Tupolev Tu-104)',
    manufacturer: '图波列夫',
    country: '苏联',
    firstFlightYear: 1955,
    tier: 7,
    era: '喷气时代',
    x: 12,
    y: 4,
    cost: 1500,
    prerequisitesAircraft: ['dehavilland_comet'],
    unlockByModules: ['dehavilland_comet_engine'],
    successors: ['boeing_707'],
    highlights: {
      materials: '军用平台民航化带来结构与系统折中',
      aerodynamics: '强调高速与高空，但低速与操纵裕度更敏感',
      business: '国家主导运营，商业盈利不是唯一目标',
      geopolitics: '冷战背景下的技术展示与航线外交',
      performance: '喷气客机早期代表之一，体现军转民路线'
    }
  },
  {
    id: 'boeing_707',
    name: '波音 707',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 1957,
    tier: 7,
    era: '喷气时代',
    x: 13,
    y: 2,
    cost: 1600,
    prerequisitesAircraft: ['dehavilland_comet'],
    unlockByModules: ['dehavilland_comet_wing'],
    successors: ['dc8', 'boeing_727', 'concorde'],
    highlights: {
      materials: '可靠的加压结构与维护体系推动规模化运营',
      aerodynamics: '后掠翼+涡喷/涡扇适配高速巡航',
      business: '喷气化改写航空公司竞争：速度、品牌与网络效应',
      geopolitics: '认证、出口与航权谈判共同决定市场版图',
      performance: '典型巡航M0.8级，奠定喷气干线时代'
    }
  },
  {
    id: 'dc8',
    name: '道格拉斯 DC-8',
    manufacturer: 'Douglas',
    country: '美国',
    firstFlightYear: 1958,
    tier: 7,
    era: '喷气时代',
    x: 14,
    y: 3,
    cost: 1650,
    prerequisitesAircraft: ['boeing_707'],
    unlockByModules: ['boeing_707_body'],
    successors: ['boeing_727'],
    highlights: {
      materials: '结构与系统工程成熟，维护与改型能力提升',
      aerodynamics: '干线高速巡航效率竞争更激烈',
      business: '同代竞争迫使改型与运营支持成为卖点',
      geopolitics: '全球航线与机场体系扩张支撑大规模喷气化',
      performance: '喷气干线竞品，体现市场竞争与改型策略'
    }
  },
  {
    id: 'boeing_727',
    name: '波音 727',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 1963,
    tier: 8,
    era: '喷气时代',
    x: 15,
    y: 2,
    cost: 1850,
    prerequisitesAircraft: ['boeing_707'],
    unlockByModules: ['boeing_707_engine'],
    successors: ['boeing_737'],
    highlights: {
      materials: '系统复杂度提升，维护与调度成为运营核心',
      aerodynamics: '适配中短程与较差机场条件的高升力体系',
      business: '机场噪声与运行限制影响航线与机型选择',
      geopolitics: '地区航线网络扩张与机场标准推动机型分化',
      performance: '三发年代的中短程干线方案，强调适航与机场适配'
    }
  },
  {
    id: 'boeing_737',
    name: '波音 737',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 1967,
    tier: 8,
    era: '喷气时代',
    x: 16,
    y: 2,
    cost: 1950,
    prerequisitesAircraft: ['boeing_727'],
    unlockByModules: ['boeing_727_wing'],
    successors: ['a320', 'boeing_747'],
    highlights: {
      materials: '长期量产要求一致性、可维护性与供应链韧性',
      aerodynamics: '中短程效率优化，强调周转与可靠性',
      business: '规模化机型的利润来自全生命周期与改型体系',
      geopolitics: '全球供应链与认证体系决定交付速度与市场覆盖',
      performance: '短中程主力平台，强调出勤率与运营成本'
    }
  },
  {
    id: 'concorde',
    name: '协和式 (Concorde)',
    manufacturer: 'BAC / Sud Aviation',
    country: '英法',
    firstFlightYear: 1969,
    tier: 8,
    era: '超音速尝试',
    x: 17,
    y: 5,
    cost: 2100,
    prerequisitesAircraft: ['boeing_707'],
    unlockByModules: ['boeing_707_wing'],
    successors: [],
    highlights: {
      materials: '高温环境下材料与结构热膨胀成为设计中心',
      aerodynamics: '三角翼与超音速升阻权衡，噪声与热问题突出',
      business: '高成本高票价小众市场，受燃油价格与噪声政策制约',
      geopolitics: '英法合作的政治工程，国际规则与环保争议影响运营',
      performance: 'M2级超音速客机，技术辉煌但商业受限，体现技术断层'
    }
  },
  {
    id: 'boeing_747',
    name: '波音 747',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 1969,
    tier: 8,
    era: '宽体时代',
    x: 17,
    y: 3,
    cost: 2200,
    prerequisitesAircraft: ['boeing_737'],
    unlockByModules: ['boeing_737_engine'],
    successors: ['dc10', 'a300'],
    highlights: {
      materials: '大型结构与系统冗余提升，维护体系走向复杂化',
      aerodynamics: '宽体+高涵道比提升座公里成本效率',
      business: '枢纽化与国际航线扩张驱动宽体需求',
      geopolitics: '全球化客运与航权谈判推动大飞机时代',
      performance: '远程宽体代表，改变国际旅行与航空公司规模经济'
    }
  }
  ,
  {
    id: 'fokker_e',
    name: '福克 E 单翼战斗机 (Eindecker)',
    manufacturer: '福克',
    country: '德国',
    firstFlightYear: 1915,
    tier: 3,
    era: '一战中后期',
    x: 5,
    y: 5,
    cost: 360,
    prerequisitesAircraft: ['etrich_taube'],
    unlockByModules: ['etrich_taube_engine'],
    successors: ['sopwith_camel', 'fokker_dr1'],
    highlights: {
      materials: '木布结构在高机动载荷下暴露疲劳与一致性问题',
      aerodynamics: '单翼低阻与高机动控制，配合武器系统改变空战形态',
      business: '战时订单压缩迭代周期，前线反馈驱动快速改型',
      geopolitics: '技术垄断造成阶段性空权优势，迫使对手加速追赶',
      performance: '速度约百余公里/小时量级，机动性成为核心指标'
    }
  },
  {
    id: 'sopwith_camel',
    name: '索普威思 骆驼 (Sopwith Camel)',
    manufacturer: '索普威思',
    country: '英国',
    firstFlightYear: 1916,
    tier: 3,
    era: '一战中后期',
    x: 6,
    y: 4,
    cost: 420,
    prerequisitesAircraft: ['fokker_e'],
    unlockByModules: ['fokker_e_wing'],
    successors: ['spad_s13', 'fokker_dr1'],
    highlights: {
      materials: '木布工艺成熟到可规模化，质量控制与维修体系成为战力',
      aerodynamics: '紧凑双翼以升力换机动，适合狗斗但牺牲高速效率',
      business: '训练与后勤成本上升，性能不再只由机体决定',
      geopolitics: '协约国凭借工业与海运体系保持供给，逐步扭转局面',
      performance: '机动性突出但更难飞，体现性能与风险的权衡'
    }
  },
  {
    id: 'spad_s13',
    name: 'SPAD S.XIII',
    manufacturer: 'SPAD',
    country: '法国',
    firstFlightYear: 1917,
    tier: 3,
    era: '一战中后期',
    x: 7,
    y: 4,
    cost: 480,
    prerequisitesAircraft: ['sopwith_camel'],
    unlockByModules: ['sopwith_camel_engine'],
    successors: ['junkers_j1'],
    highlights: {
      materials: '更强结构把高速俯冲带来的载荷承受住，强调强度与一致性',
      aerodynamics: '更偏向高速能量战术，强调速度与俯冲而非极限盘旋',
      business: '王牌飞行员与宣传推动特定机型需求，但量产与维护决定主力地位',
      geopolitics: '空战从单机对抗走向体系对抗，工业能力影响持续作战',
      performance: '速度与结构强度优势明显，代表“高速战斗机”思路'
    }
  },
  {
    id: 'fokker_dr1',
    name: '福克 Dr.I 三翼机 (Fokker Dr.I)',
    manufacturer: '福克',
    country: '德国',
    firstFlightYear: 1917,
    tier: 3,
    era: '一战中后期',
    x: 7,
    y: 6,
    cost: 520,
    prerequisitesAircraft: ['fokker_e'],
    unlockByModules: ['fokker_e_engine'],
    successors: [],
    highlights: {
      materials: '结构复杂导致一致性与维护成本更高，难以长期量产迭代',
      aerodynamics: '三翼强化升力与盘旋，但阻力巨大，注定是特化路线',
      business: '特化机型训练与后勤成本高，在总量战争中常被更通用平台替代',
      geopolitics: '资源与产能约束会把技术路线拉回可持续方向',
      performance: '爬升与机动强但高速不足，体现技术断层'
    }
  },
  {
    id: 'junkers_j1',
    name: '容克 J 1（全金属试验机）',
    manufacturer: 'Junkers',
    country: '德国',
    firstFlightYear: 1915,
    tier: 4,
    era: '两战之间',
    x: 8,
    y: 2,
    cost: 650,
    prerequisitesAircraft: ['spad_s13'],
    unlockByModules: ['spad_s13_body'],
    successors: ['junkers_f13'],
    highlights: {
      materials: '全金属结构把材料学推到舞台中心：疲劳、腐蚀与制造精度成为核心',
      aerodynamics: '金属蒙皮让外形更可控，但结构设计与阻力控制需要新的工程方法',
      business: '金属化提高前期成本，但降低长期维护与提升一致性，利于商业化',
      geopolitics: '战时技术试验为战后民航打基础，军用研发外溢到民用',
      performance: '全金属路线的里程碑，铺路到F.13等民航平台'
    }
  },
  {
    id: 'dc3',
    name: '道格拉斯 DC-3',
    manufacturer: '道格拉斯',
    country: '美国',
    firstFlightYear: 1935,
    tier: 6,
    era: '商业航空崛起',
    x: 10,
    y: 4,
    cost: 1200,
    prerequisitesAircraft: ['boeing_247'],
    unlockByModules: ['boeing_247_engine'],
    successors: ['lockheed_constellation'],
    highlights: {
      materials: '铝合金半硬壳与标准化铆接让维护进入计划化',
      aerodynamics: '低翼+高升力装置提升效率与安全',
      business: '被认为是首批能靠票价盈利的客机之一，重塑航空公司模型',
      geopolitics: '战争时期平台民用转军用，运输能力成为战略资产',
      performance: '巡航约300km/h、航程约2,000km量级，商业航空拐点'
    }
  },
  {
    id: 'dc10',
    name: '麦道 DC-10',
    manufacturer: 'McDonnell Douglas',
    country: '美国',
    firstFlightYear: 1970,
    tier: 9,
    era: '宽体时代',
    x: 18,
    y: 2,
    cost: 2500,
    prerequisitesAircraft: ['boeing_747'],
    unlockByModules: ['boeing_747_body'],
    successors: ['l1011', 'a300'],
    highlights: {
      materials: '宽体结构与系统复杂度提高，维护与改型成为长期工程',
      aerodynamics: '三发宽体强调中远程效率与机场适配',
      business: '宽体竞争激烈，安全、信誉与运营成本共同决定命运',
      geopolitics: '监管与适航标准趋严，事故与舆论会改变市场格局',
      performance: '三发宽体方案，体现效率、冗余与成本的复杂权衡'
    }
  },
  {
    id: 'l1011',
    name: '洛克希德 L-1011 三星 (TriStar)',
    manufacturer: 'Lockheed',
    country: '美国',
    firstFlightYear: 1970,
    tier: 9,
    era: '宽体时代',
    x: 19,
    y: 3,
    cost: 2550,
    prerequisitesAircraft: ['dc10'],
    unlockByModules: ['dc10_engine'],
    successors: ['a300'],
    highlights: {
      materials: '系统集成与可靠性工程复杂，供应链稳定性决定交付',
      aerodynamics: '三发布局与先进自动化提升航程与运营体验',
      business: '发动机与供应链问题会让再好的飞机也错过市场窗口',
      geopolitics: '产业链与认证体系影响出口与交付节奏',
      performance: '宽体三发代表，强调系统先进但受供应链制约'
    }
  },
  {
    id: 'a300',
    name: '空客 A300',
    manufacturer: 'Airbus',
    country: '欧盟',
    firstFlightYear: 1972,
    tier: 9,
    era: '宽体时代',
    x: 20,
    y: 4,
    cost: 2600,
    prerequisitesAircraft: ['dc10'],
    unlockByModules: ['dc10_wing'],
    successors: ['a310', 'a320'],
    highlights: {
      materials: '欧洲合作制造体系成型，多国分工带来工程与管理挑战',
      aerodynamics: '双发宽体强调中程效率与座公里成本',
      business: '空客用共同平台与改型策略进入市场，争夺航空公司机队份额',
      geopolitics: '欧洲产业政策与跨国合作塑造竞争力，并与波音形成长期对峙',
      performance: '双发宽体开端之一，奠定空客平台化路线'
    }
  },
  {
    id: 'a310',
    name: '空客 A310',
    manufacturer: 'Airbus',
    country: '欧盟',
    firstFlightYear: 1982,
    tier: 9,
    era: '宽体时代',
    x: 21,
    y: 4,
    cost: 2700,
    prerequisitesAircraft: ['a300'],
    unlockByModules: ['a300_body'],
    successors: ['a320'],
    highlights: {
      materials: '平台化让改型与维护共享成为成本优势',
      aerodynamics: '在同平台上做效率优化，体现小步快跑的迭代策略',
      business: '以机队通用性打动航空公司，降低培训与备件成本',
      geopolitics: '跨国项目的成功建立在长期政策协同与供应链协调上',
      performance: '中远程双发宽体改型，强调运营经济性'
    }
  },
  {
    id: 'a320',
    name: '空客 A320',
    manufacturer: 'Airbus',
    country: '欧盟',
    firstFlightYear: 1987,
    tier: 9,
    era: '航电与飞控革命',
    x: 22,
    y: 2,
    cost: 2800,
    prerequisitesAircraft: ['a300'],
    unlockByModules: ['a300_engine'],
    successors: ['a330', 'e190'],
    highlights: {
      materials: '结构与系统更依赖可靠的制造一致性与维护数据闭环',
      aerodynamics: '中短程效率优化与噪声/环保约束并存',
      business: '电传飞控与统一座舱降低训练成本，平台化改写机队经济学',
      geopolitics: '认证体系与安全文化影响新技术被市场接受的速度',
      performance: '中短程主力平台，强调可靠性、周转与机队通用性'
    }
  },
  {
    id: 'a330',
    name: '空客 A330',
    manufacturer: 'Airbus',
    country: '欧盟',
    firstFlightYear: 1992,
    tier: 10,
    era: '远程双发',
    x: 23,
    y: 3,
    cost: 2950,
    prerequisitesAircraft: ['a320'],
    unlockByModules: ['a320_wing'],
    successors: ['a340', 'a380'],
    highlights: {
      materials: '远程运营强调结构寿命、维护可预测性与备件网络',
      aerodynamics: '双发远程依赖高效率机翼与高涵道比涡扇',
      business: 'ETOPS规则让双发远程成为可能，改变航线与机队策略',
      geopolitics: '国际规则与认证直接影响远洋航线运营边界',
      performance: '双发宽体远程主力之一，座公里成本与航程平衡'
    }
  },
  {
    id: 'a340',
    name: '空客 A340',
    manufacturer: 'Airbus',
    country: '欧盟',
    firstFlightYear: 1991,
    tier: 10,
    era: '远程四发',
    x: 24,
    y: 4,
    cost: 3000,
    prerequisitesAircraft: ['a330'],
    unlockByModules: ['a330_engine'],
    successors: ['boeing_777'],
    highlights: {
      materials: '四发意味着更多系统与维护点，可靠性工程更复杂',
      aerodynamics: '远程巡航效率与冗余并存，但油耗压力更大',
      business: '燃油价格与双发规则变化会改变四发机型的生命周期',
      geopolitics: '远程航线与国际枢纽竞争加剧，机队选择体现战略',
      performance: '远程四发平台，体现冗余与经济性的长期拉扯'
    }
  },
  {
    id: 'boeing_777',
    name: '波音 777',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 1994,
    tier: 10,
    era: '远程双发',
    x: 25,
    y: 2,
    cost: 3100,
    prerequisitesAircraft: ['a340'],
    unlockByModules: ['a340_wing'],
    successors: ['boeing_787', 'a350'],
    highlights: {
      materials: '结构与系统以可靠性与维护经济学为中心，数据驱动保障',
      aerodynamics: '高效率翼型与大推力涡扇支撑长航程双发',
      business: '双发远程成为主流，座公里成本与航线灵活性是关键卖点',
      geopolitics: '全球供应链与客户共研模式改变开发流程',
      performance: '双发远程旗舰之一，体现效率与运力平衡'
    }
  },
  {
    id: 'boeing_787',
    name: '波音 787 “梦想客机”',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 2009,
    tier: 10,
    era: '复材与效率',
    x: 26,
    y: 2,
    cost: 3200,
    prerequisitesAircraft: ['boeing_777'],
    unlockByModules: ['boeing_777_body'],
    successors: ['a350'],
    highlights: {
      materials: '复合材料占比上升，制造与修理工艺体系发生变化',
      aerodynamics: '以燃油效率与舒适性为目标，强调翼型与系统协同',
      business: '点对点航线模型兴起，效率提升让二线城市直飞可行',
      geopolitics: '全球外包供应链提升协同难度，影响进度与成本控制',
      performance: '高效率远程双发，体现材料与系统工程的综合收益'
    }
  },
  {
    id: 'a350',
    name: '空客 A350',
    manufacturer: 'Airbus',
    country: '欧盟',
    firstFlightYear: 2013,
    tier: 10,
    era: '复材与效率',
    x: 27,
    y: 3,
    cost: 3300,
    prerequisitesAircraft: ['boeing_777'],
    unlockByModules: ['boeing_777_engine'],
    successors: ['a380'],
    highlights: {
      materials: '复合材料与先进合金混用，关注疲劳、修理与寿命成本',
      aerodynamics: '大展弦比高效率机翼降低油耗，配合新一代高涵道比涡扇',
      business: '与同代机型竞争靠全生命周期成本与机队通用性',
      geopolitics: '欧洲产业链与全球客户协作共同影响研发节奏',
      performance: '新一代远程双发宽体，强调效率与舒适性'
    }
  },
  {
    id: 'a380',
    name: '空客 A380',
    manufacturer: 'Airbus',
    country: '欧盟',
    firstFlightYear: 2005,
    tier: 10,
    era: '宽体巨无霸',
    x: 28,
    y: 5,
    cost: 3600,
    prerequisitesAircraft: ['a330'],
    unlockByModules: ['a330_body', 'a330_engine'],
    successors: [],
    highlights: {
      materials: '大尺寸结构的制造与维护可预测性是核心，复材与合金混用带来新工艺',
      aerodynamics: '超大机翼与复杂高升力系统以控制油耗与噪声',
      business: '枢纽—辐射模型的极致，机场资源与上座率决定盈利',
      geopolitics: '欧洲多国合作与产业政策深度绑定，是与波音竞争的象征项目',
      performance: '500+座级、航程约15,000km级，工程辉煌但商业受生态制约'
    }
  },
  {
    id: 'e190',
    name: 'Embraer E190（支线喷气）',
    manufacturer: 'Embraer',
    country: '巴西',
    firstFlightYear: 2004,
    tier: 10,
    era: '支线网络',
    x: 24,
    y: 6,
    cost: 3000,
    prerequisitesAircraft: ['a320'],
    unlockByModules: ['a320_body'],
    successors: [],
    highlights: {
      materials: '支线机强调维护简化与高周转，结构寿命与可靠性优先',
      aerodynamics: '针对短航段优化，强调低速效率与机场适应',
      business: '支线连接二线城市，网络效应与周转率决定盈利',
      geopolitics: '区域市场与航空政策影响支线需求，制造商依赖出口与金融支持',
      performance: '百座级支线喷气，强调高频次与低成本运营'
    }
  }
  ,
  {
    id: 'airco_dh2',
    name: 'Airco DH.2（推式战斗机）',
    manufacturer: 'Airco',
    country: '英国',
    firstFlightYear: 1915,
    tier: 3,
    era: '一战中后期',
    x: 6,
    y: 6,
    cost: 420,
    prerequisitesAircraft: ['fokker_e'],
    unlockByModules: ['fokker_e_body'],
    successors: ['sopwith_camel'],
    highlights: {
      materials: '推式布局导致结构与受力更复杂，前线维护压力更大',
      aerodynamics: '把螺旋桨放到后方绕开射击问题，但阻力更高',
      business: '战时临时方案能快速投产，但会被更优路线很快替代',
      geopolitics: '技术过渡期的产物，反映快速军备竞赛中的折中',
      performance: '机动尚可但效率不佳，体现过渡技术的短生命周期'
    }
  },
  {
    id: 'albatros_d3',
    name: '阿尔巴特罗斯 D.III',
    manufacturer: 'Albatros',
    country: '德国',
    firstFlightYear: 1916,
    tier: 3,
    era: '一战中后期',
    x: 6,
    y: 5,
    cost: 450,
    prerequisitesAircraft: ['fokker_e'],
    unlockByModules: ['fokker_e_engine'],
    successors: ['fokker_dr1'],
    highlights: {
      materials: '半硬壳木结构提升强度与流线性，但制造更吃工艺一致性',
      aerodynamics: '更流线的机身与双翼布局带来更高速度与爬升',
      business: '批量生产与前线反馈循环推动快速改进',
      geopolitics: '制空权争夺迫使机型不断迭代，工业能力决定持续优势',
      performance: '一战中期主力战斗机之一，代表高速与机动的折中'
    }
  },
  {
    id: 'boeing_767',
    name: '波音 767',
    manufacturer: 'Boeing',
    country: '美国',
    firstFlightYear: 1981,
    tier: 9,
    era: '双发宽体普及',
    x: 21,
    y: 1,
    cost: 2700,
    prerequisitesAircraft: ['boeing_747'],
    unlockByModules: ['boeing_747_engine'],
    successors: ['boeing_777'],
    highlights: {
      materials: '结构与系统以运营经济性与维护可预测性为中心',
      aerodynamics: '双发宽体强调座公里成本与航线灵活性',
      business: '双发远程与机队通用性提升，改变航空公司采购策略',
      geopolitics: 'ETOPS规则与国际认证推动双发跨洋成为现实',
      performance: '双发宽体的重要普及节点，为后续远程双发铺路'
    }
  },
  {
    id: 'airbus_a220',
    name: '空客 A220（原CSeries）',
    manufacturer: 'Airbus',
    country: '欧盟/加拿大',
    firstFlightYear: 2013,
    tier: 10,
    era: '支线网络',
    x: 25,
    y: 6,
    cost: 3200,
    prerequisitesAircraft: ['e190'],
    unlockByModules: ['e190_engine'],
    successors: [],
    highlights: {
      materials: '新一代支线机强调效率与维护经济学，结构与系统高度优化',
      aerodynamics: '以短中程效率与低噪声为目标，强调翼型与发动机匹配',
      business: '支线市场竞争靠油耗、周转与机队通用性',
      geopolitics: '跨国并购与产业整合影响品牌与供应链稳定性',
      performance: '百座级高效率平台，体现“支线也要像干线一样省油”'
    }
  }
]

export const AIRCRAFT_META: AircraftMeta[] = [...CORE_AIRCRAFT_META, ...GENERATED_AIRCRAFT.map(genAircraftMeta)]

const costBaseForTier = (tier: number) => tier * 120

export const AIRCRAFT_NODES: AircraftNode[] = AIRCRAFT_META.map(a => {
  const wingId = `${a.id}_wing`
  const engineId = `${a.id}_engine`
  const bodyId = `${a.id}_body`
  return {
    id: a.id,
    name: a.name,
    manufacturer: a.manufacturer,
    country: a.country,
    firstFlightYear: a.firstFlightYear,
    tier: a.tier,
    era: a.era,
    x: a.x,
    y: a.y,
    cost: a.cost,
    prerequisitesAircraft: a.prerequisitesAircraft,
    unlockByModules: a.unlockByModules,
    moduleIds: [wingId, engineId, bodyId],
    successors: a.successors,
    story: mkStory(a.notes),
    canonicalBuild: { wing: wingId, engine: engineId, body: bodyId }
  }
})

export const MODULE_NODES: ModuleNode[] = AIRCRAFT_META.flatMap(a => {
  const base = costBaseForTier(a.tier)
  const wing = mkModule(a.id, `${a.id}_wing`, a.modules[0], a.tier, Math.floor(base * 0.8))
  const engine = mkModule(a.id, `${a.id}_engine`, a.modules[1], a.tier, Math.floor(base * 0.9))
  const body = mkModule(a.id, `${a.id}_body`, a.modules[2], a.tier, Math.floor(base * 0.7))
  return [wing, engine, body]
})

export const AIRCRAFT_BY_ID: Record<string, AircraftNode> = byId(AIRCRAFT_NODES)
export const MODULE_BY_ID: Record<string, ModuleNode> = byId(MODULE_NODES)

export const INITIAL_AIRCRAFT_ID = 'wright_flyer'
export const INITIAL_UNLOCKED_MODULE_IDS: string[] = ['wright_flyer_wing', 'wright_flyer_engine', 'wright_flyer_body']
