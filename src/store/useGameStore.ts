import { create } from 'zustand'
import { AIRCRAFT_BY_ID, AIRCRAFT_NODES, INITIAL_AIRCRAFT_ID, INITIAL_UNLOCKED_MODULE_IDS, MODULE_BY_ID, Part } from '../data/aviationTree'
import { GameOrder, SPECIAL_ORDERS, createDailyOrder } from '../data/orders'

interface GameState {
  scene: 'intro' | 'workshop' | 'result'
  setScene: (scene: 'intro' | 'workshop' | 'result') => void

  money: number
  researchPoints: number
  currentYear: number

  unlockedParts: Part[]
  unlockedAircraftIds: string[]
  unlockedModuleIds: string[]
  selectedAircraftId: string | null

  currentOrder: GameOrder
  specialIndex: number
  dailySeed: number

  assembledBlueprint: {
    wing: Part | null
    engine: Part | null
    body: Part | null
  }

  matchedAircraftId: string | null

  aircraftModalId: string | null
  lastResult: { success: boolean; message: string; proceedAction: 'advance' | 'retry' | 'skip' } | null

  startGame: () => void
  resetGame: () => void
  equipPart: (part: Part) => void
  unequipPart: (type: 'wing' | 'engine' | 'body') => void
  submitBlueprint: () => void
  continueAfterResult: () => void

  selectAircraft: (aircraftId: string | null) => void
  unlockAircraft: (aircraftId: string, payWith?: 'rp' | 'money') => void
  unlockModule: (moduleId: string) => void

  openAircraftModal: (aircraftId: string) => void
  closeAircraftModal: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  scene: 'intro',
  setScene: (scene) => set({ scene }),

  money: 0,
  researchPoints: 0,
  currentYear: 1903,

  unlockedParts: [],
  unlockedAircraftIds: [],
  unlockedModuleIds: [],
  selectedAircraftId: null,

  currentOrder: SPECIAL_ORDERS[0],
  specialIndex: 0,
  dailySeed: 1,

  assembledBlueprint: { wing: null, engine: null, body: null },
  matchedAircraftId: null,
  aircraftModalId: null,
  lastResult: null,

  startGame: () => {
    const initialParts = INITIAL_UNLOCKED_MODULE_IDS.map(id => MODULE_BY_ID[id]?.part).filter(Boolean) as Part[]
    set({
      scene: 'workshop',
      money: 800,
      researchPoints: 320,
      currentYear: SPECIAL_ORDERS[0].year,
      unlockedParts: initialParts,
      unlockedAircraftIds: [INITIAL_AIRCRAFT_ID],
      unlockedModuleIds: [...INITIAL_UNLOCKED_MODULE_IDS],
      selectedAircraftId: INITIAL_AIRCRAFT_ID,
      currentOrder: SPECIAL_ORDERS[0],
      specialIndex: 0,
      dailySeed: 1,
      assembledBlueprint: { wing: null, engine: null, body: null },
      matchedAircraftId: null,
      aircraftModalId: null,
      lastResult: null
    })
  },

  resetGame: () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch {}
    set({
      scene: 'intro',
      money: 0,
      researchPoints: 0,
      currentYear: 1903,
      unlockedParts: [],
      unlockedAircraftIds: [],
      unlockedModuleIds: [],
      selectedAircraftId: null,
      currentOrder: SPECIAL_ORDERS[0],
      specialIndex: 0,
      dailySeed: 1,
      assembledBlueprint: { wing: null, engine: null, body: null },
      matchedAircraftId: null,
      aircraftModalId: null,
      lastResult: null
    })
  },

  equipPart: (part) => {
    set((state) => {
      const assembledBlueprint = { ...state.assembledBlueprint, [part.type]: part }
      const matchedAircraftId =
        AIRCRAFT_NODES.find(a =>
          a.canonicalBuild.wing === assembledBlueprint.wing?.id &&
          a.canonicalBuild.engine === assembledBlueprint.engine?.id &&
          a.canonicalBuild.body === assembledBlueprint.body?.id
        )?.id || null
      return { assembledBlueprint, matchedAircraftId }
    })
  },

  unequipPart: (type) => {
    set((state) => {
      const assembledBlueprint = { ...state.assembledBlueprint, [type]: null }
      return { assembledBlueprint, matchedAircraftId: null }
    })
  },

  submitBlueprint: () => {
    const state = get()
    const { wing, engine, body } = state.assembledBlueprint
    const { currentOrder } = state

    if (!wing || !engine || !body) {
      const missing = [
        !wing ? '机翼（Wing）' : null,
        !engine ? '引擎（Engine）' : null,
        !body ? '机身（Body）' : null
      ].filter(Boolean)

      const longMessage =
        `【结论】装配未完成，无法进行试飞与交付。\n\n` +
        `【任务】${currentOrder.year} · ${currentOrder.title}\n${currentOrder.description}\n\n` +
        `【缺失清单】${missing.join('、')}。\n\n` +
        `【工程说明】在航空工程里，“能飞”并不是一个按钮，而是一条严格的闭环：结构（承载与连接）、动力（推重比与可靠性）、机体（配平与任务布置）缺一不可。` +
        `哪怕只缺一个模块，试飞的风险也会从“性能不足”升级为“结构失效/失控/无法返航”。因此本项目把三件套作为最低门槛，是为了让你在做选择前先建立工程直觉。\n\n` +
        `【下一步建议】\n- 如果你追求更高速度：先补齐动力，再用更低阻力/更轻的机身去“放大”推力收益。\n- 如果你追求更高升力或更安全的起降：优先选择更大翼面积或更稳定的翼型，再根据重量增长反推动力需求。\n- 如果订单开始强调机动：意味着结构载荷与操纵响应会成为新的瓶颈，盲目堆升力/速度反而可能让设计更危险。\n\n` +
        `【提示】你可以打开科技树，研发关键模块来补齐仓库，再回到车间完成装配。`

      set({
        lastResult: {
          success: false,
          proceedAction: 'retry',
          message: longMessage
        },
        scene: 'result'
      })
      return
    }

    const totalSpeed = wing.stats.speed + engine.stats.speed + body.stats.speed
    const totalLift = wing.stats.lift + engine.stats.lift + body.stats.lift
    const totalWeight = wing.stats.weight + engine.stats.weight + body.stats.weight
    const totalManeuverability = (wing.stats.maneuverability || 0) + (engine.stats.maneuverability || 0) + (body.stats.maneuverability || 0)

    const success =
      totalSpeed >= currentOrder.requirements.minSpeed &&
      totalLift >= currentOrder.requirements.minLift &&
      totalWeight <= currentOrder.requirements.maxWeight &&
      (currentOrder.requirements.minManeuverability === undefined || totalManeuverability >= currentOrder.requirements.minManeuverability)

    const matchedAircraft =
      state.matchedAircraftId ? AIRCRAFT_BY_ID[state.matchedAircraftId] : null

    const reqLines = [
      `速度：${totalSpeed} / ${currentOrder.requirements.minSpeed}`,
      `升力：${totalLift} / ${currentOrder.requirements.minLift}`,
      `重量：${totalWeight} / ${currentOrder.requirements.maxWeight}`
    ]
    if (currentOrder.requirements.minManeuverability !== undefined) {
      reqLines.push(`机动：${totalManeuverability} / ${currentOrder.requirements.minManeuverability}`)
    }

    const orderContext =
      currentOrder.kind === 'special'
        ? `这是一个历史节点任务，代表时代窗口与资源倾斜。即使失败，你也会错过这一次“最佳入场时机”，但历史仍会向前推进。`
        : `这是日常订单，指标更温和，目的是维持现金流与科研节奏，用“小步快跑”的方式积累下一次关键突破所需的资源。`

    const matchedContext =
      matchedAircraft
        ? `\n\n机型匹配：你当前的装配组合与“${matchedAircraft.name}”的典型配置高度一致。` +
          `这类机型在历史上之所以能出现，往往是材料体系、气动取舍与商业/军事需求共同作用的结果：${matchedAircraft.story.summary}\n`
        : `\n\n机型匹配：当前装配并未命中某一台历史机型的标准三件套，但这并不代表设计没有价值——航空史上大量机型正是通过“无数次不被记住的改型”走向成熟。`

    const advice =
      `\n\n数据解读：\n- ${reqLines.join('\n- ')}\n\n` +
      `工程建议：如果速度不足，优先考虑动力模块（推重比）或降低阻力/重量；如果升力不足，考虑更大翼面积或提高低速升力配置；如果超重，说明结构/系统复杂度已经超过当前材料与动力的承载边界。` +
      `当订单引入机动性要求时，意味着你进入了“操纵响应与结构载荷”的博弈：更强机动常常伴随更高风险与维护压力。`

    const longMessage =
      `${success ? '【结论】试飞通过，订单可交付。' : '【结论】试飞未通过，未满足订单阈值。'}\n\n` +
      `【任务】${currentOrder.year} · ${currentOrder.title}\n${currentOrder.description}\n\n` +
      `【时代说明】${orderContext}\n` +
      matchedContext +
      advice +
      `\n\n【奖励】资金 $${currentOrder.rewards.money} · 科研点 ${currentOrder.rewards.researchPoints}（仅在成功交付时获得）`

    if (success) {
      set({
        money: state.money + currentOrder.rewards.money,
        researchPoints: state.researchPoints + currentOrder.rewards.researchPoints,
        lastResult: {
          success: true,
          proceedAction: 'advance',
          message: longMessage
        },
        scene: 'result'
      })
    } else {
      set({
        lastResult: {
          success: false,
          proceedAction: currentOrder.kind === 'special' ? 'skip' : 'retry',
          message: longMessage
        },
        scene: 'result'
      })
    }
  },

  continueAfterResult: () => {
    const state = get()
    const { lastResult, currentOrder } = state
    if (!lastResult) return

    if (lastResult.proceedAction === 'retry') {
      set({ scene: 'workshop', lastResult: null })
      return
    }

    let nextYear = state.currentYear
    let nextSpecialIndex = state.specialIndex
    let nextDailySeed = state.dailySeed

    if (currentOrder.kind === 'special') {
      nextSpecialIndex = Math.min(SPECIAL_ORDERS.length, state.specialIndex + 1)
      nextYear = currentOrder.year + 1
    } else {
      nextYear = state.currentYear + 1
      nextDailySeed = state.dailySeed + 1
    }

    let nextOrder: GameOrder
    const nextSpecial = SPECIAL_ORDERS[nextSpecialIndex]
    if (nextSpecial && nextSpecial.year <= nextYear) {
      nextOrder = nextSpecial
      nextYear = nextSpecial.year
    } else {
      nextOrder = createDailyOrder(nextYear, nextDailySeed)
    }

    set({
      currentYear: nextYear,
      currentOrder: nextOrder,
      specialIndex: nextSpecialIndex,
      dailySeed: nextDailySeed,
      scene: 'workshop',
      lastResult: null
    })
  },

  selectAircraft: (aircraftId) => set({ selectedAircraftId: aircraftId }),

  unlockAircraft: (aircraftId, payWith) => {
    const state = get()
    if (state.unlockedAircraftIds.includes(aircraftId)) return
    const aircraft = AIRCRAFT_BY_ID[aircraftId]
    if (!aircraft) return

    const prereqOk = aircraft.prerequisitesAircraft.every(id => state.unlockedAircraftIds.includes(id))
    const modulesOk = aircraft.unlockByModules.every(id => state.unlockedModuleIds.includes(id))
    if (!prereqOk || !modulesOk) {
      alert('解锁条件未满足！')
      return
    }

    const isAircraftCompleted = (aid: string) => {
      const a = AIRCRAFT_BY_ID[aid]
      if (!a) return false
      return a.moduleIds.every(mid => state.unlockedModuleIds.includes(mid))
    }

    const completedTiers = new Set<number>()
    for (const aid of state.unlockedAircraftIds) {
      if (isAircraftCompleted(aid)) completedTiers.add(AIRCRAFT_BY_ID[aid]?.tier ?? -1)
    }

    const moneyCost = Math.max(500, Math.round(aircraft.cost * 10 + aircraft.tier * 300))
    const canUseMoney = completedTiers.has(aircraft.tier) && state.money >= moneyCost

    const tryPayWithMoney = payWith === 'money' || (payWith === undefined && state.researchPoints < aircraft.cost && canUseMoney)
    if (tryPayWithMoney) {
      if (!canUseMoney) {
        alert('需要先完整研发同级别任意机型（机体+全部模块），且资金充足。')
        return
      }
      set({
        money: state.money - moneyCost,
        unlockedAircraftIds: [...state.unlockedAircraftIds, aircraftId],
        selectedAircraftId: aircraftId
      })
      return
    }

    if (state.researchPoints < aircraft.cost) {
      alert('科研点数不足！')
      return
    }

    set({
      researchPoints: state.researchPoints - aircraft.cost,
      unlockedAircraftIds: [...state.unlockedAircraftIds, aircraftId],
      selectedAircraftId: aircraftId
    })
  },

  unlockModule: (moduleId) => {
    const state = get()
    if (state.unlockedModuleIds.includes(moduleId)) return
    const module = MODULE_BY_ID[moduleId]
    if (!module) return
    if (!state.unlockedAircraftIds.includes(module.aircraftId)) {
      alert('请先研发该机型！')
      return
    }
    if (state.researchPoints < module.cost) {
      alert('科研点数不足！')
      return
    }

    set({
      researchPoints: state.researchPoints - module.cost,
      unlockedModuleIds: [...state.unlockedModuleIds, moduleId],
      unlockedParts: [...state.unlockedParts, module.part]
    })
  },

  openAircraftModal: (aircraftId) => set({ aircraftModalId: aircraftId }),
  closeAircraftModal: () => set({ aircraftModalId: null })
}))
