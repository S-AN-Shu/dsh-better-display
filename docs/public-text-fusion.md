# 公开正文与播报融合适配

维护分支：reader-narration-0.3.4；Reader0.3.4-yishu.reader.2，narrator0.4.0，目标内核0.2.0-rc.2。上游未适配Reader仍保留自己的正文折叠策略；本说明只约束此维护分支。

普通正文原本就是模型的公开输出。播报插件的增量是阶段解释规则、提醒去重及显示豁免，不从内部长思考推导摘要。普通正文取消首次补报并给最多30秒缓冲；显式播报重置120秒／6步计数和退避锚点。提醒使用已有请求上下文中的正文和工具结果，不增加请求或轮询。

责任分工：lib/protocol.js是narrator共用分段所有者；native/progress-protocol.ts为校验一致的副本。projection和live-turn排除空记录、建立原位步骤。Reader渲染公开文本；ChoreographedFlow只隐藏过程外层并让公开更新绕过动画。Blocks只渲染已经分好的内容，不再次过滤播报。原生消息行可见性由narrator的public-visibility登记、恢复，Reader不插手原生行。

展示身份由消息键、源块起点、字符起点组成，不包含当前分类、长度或结束位置。文字增长或前缀被认出后外层不因分类换键。思考和工具在公开文本之间形成连续折叠段，展开时仍按原始源顺序。

空白验证：实际旧适配在纯播报夹具留下25px原行（其中16px外层间距）。新夹具分别在正常／减少动画模式检查运行、完成、反复折叠、动画取消；增加100个空文本步骤不得增加布局高度。原用户大空白冷重载未复现，不把夹具根因当作该现场已确认的唯一原因。真实桌面、原会话只读测量和Windows媒体检查单独记录。

开发：npm ci；设置DSHX_HARNESS为官方dsh-v0.2.0-rc.2源码；npm run build、npm test、npm run typecheck。scripts/verify-public-flow.mjs使用实际Reader和官方Markdown组件、隔离合成会话，无模型调用；DSH_PLAYWRIGHT可指定已安装Playwright路径。--baseline可针对任务恢复目录里的旧Reader做对照。相关结果在.evidence（不提交私人会话或维护副本）。

安装：先备份已装包和Desktop profile，再用桌面插件管理器或内置包管理器安装构建包，空闲时完整退出并重新打开DSH。分别核对源码、构建包、profile安装和当前加载客户端，不能以构建成功代替运行验收。

构建验收还直接导入发出的Host入口：Windows盘符绝对路径属于本地模块，必须打入包中。仅通过TypeScript检查不能发现错误的运行时.ts引用。
