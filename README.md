# CLOUD DREAMERS（云端筑梦师）——航空文明策略经营游戏 Demo

一款以航空发展史为主线的“订单驱动 + 模块装配 + 机型科技树”策略经营 Demo：玩家扮演一家航空公司的意志/投资人/总设计师，通过完成订单获得资金与科研点，点亮机型科技树并研发模块，把历史知识“玩出来”。

文案与路演材料见：[docs/pitch.md](file:///c:/Users/%E5%88%98%E5%AD%90%E9%98%B3l/Desktop/Trae%20AI/docs/pitch.md)

## 核心玩法

- 订单：历史节点特殊订单 + 推时间的日常订单
- 车间：从仓库选择机翼/发动机/机身进行装配，提交试飞后获得工程报告式结算
- 科技树：以真实机型为节点，模块研发后解锁后继机型与分支路线
- 档案：机型与模块均为百科式分栏（材料/气动/商业/地缘/性能）

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
