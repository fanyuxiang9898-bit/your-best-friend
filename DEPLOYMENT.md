# 构建与上线

使用 Node.js 24、pnpm 9.0.0。执行 `corepack pnpm install --frozen-lockfile`，随后运行：

```sh
corepack pnpm test:unit
corepack pnpm validate
corepack pnpm build:web
corepack pnpm build:weapp
corepack pnpm build:tt
corepack pnpm build:server
corepack pnpm audit --prod --audit-level=high
```

H5、微信和抖音构建分别产生 dist-web、dist、dist-tt；小程序编译通过不代表已完成平台审核或真机验证。

## 自动化交互测试

`corepack pnpm exec playwright install chromium` 后运行 `node tests/browser.cjs`。该测试启动本地静态服务和确定性 API 测试响应，验证回退改答案、完整答题提交、结果词云、复制、重新测试、请求失败重试及空结果恢复。模型服务的真实返回需要单独线上验证。

Windows 可复用 Edge：`node tests/browser.cjs playwright "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"`。

## Node 服务部署

将整个工作区部署到支持 Node 的个人托管项目。构建 H5 和 server 后，从仓库根目录运行 `node server/dist/main.js -p 3000`（端口按平台要求通过参数指定）。Nest 同时提供 dist-web 静态页面和 `/api` 路由；健康检查为 `/api/health`。

保留原 Coze SDK 模型集成。托管平台需要该个人项目的模型访问身份，密钥不得写入源码。缺少模型访问时原有本地文案降级仍保留；它不是已经验证的真实 AI 生成。

## 依赖审计范围

当前生产依赖审计无 high/critical 告警。仍有低/中等级传递依赖告警，主要来自 Taro 自动安装的构建器 peer 依赖以及 Nest SSE 等未使用能力。Nest 当前业务只提供 JSON 接口，不使用其 SSE 序列化。CI 保留 high 阈值拦截；不对 Taro 强行跨代升级 Vite，也不忽略所有安全检查。开发服务器不得对公网开放；线上只运行生产 Nest 服务和编译好的静态文件。
