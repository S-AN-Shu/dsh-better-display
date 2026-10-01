# 可选发布版本

npm 的 `dsh-progress-narrator@0.3.0` 是独立播报插件。此仓库是 Better Display 的分发 fork，不把 Reader 补丁混入播报包。

| Better Display 版本 | 适用情况 | 下载 |
| --- | --- | --- |
| 0.3.4 上游原版 | 使用上游 Reader 行为，不包含此次播报和 Windows 图片补丁 | [原版 Release](https://github.com/S-AN-Shu/dsh-better-display/releases/tag/v0.3.4) |
| 0.3.4-yishu.reader.1 可选适配版 | 同时使用播报和 Reader，希望折叠过程后进度仍可见 | [适配版 Release](https://github.com/S-AN-Shu/dsh-better-display/releases/tag/v0.3.4-yishu.reader.1) |

两个包名都是 `dsh-better-display`，只能选择其中一个安装。下载 .tgz 后，通过 DSH 插件管理器安装本地包；已装原版时用适配版替换即可。Desktop 的托管 profile 不应套用 web profile 的 CLI 操作。更新为上游原版会替换适配包，应按所需版本手动选择。

适配保留 Reader 的过程折叠所有权，将协议进度放到折叠区外；默认普通字重、淡灰白色，无图标和背景卡片。识别前缀只在显示层隐藏，不修改会话源数据。还包含 Windows 本地 Markdown 图片地址支持。代码示例、引用、列表和用户文本不作为播报处理。

基于上游 tag `v0.3.4`（a5854e6eb4a0aca404a516007d6edf7d03bcb132）。许可与第三方声明见 LICENSE、THIRD_PARTY_NOTICES.md。适配源代码位于 `reader-narration-0.3.4` 分支；fork 的原有 main 保留。

验收：当前 DSH 0.2.0-rc.2 / Electron Node 24.18.1 上验证实际 Host 导入、Reader 折叠/展开、前缀隐藏、进度样式以及 Windows 图片读取；另有 7 项实际 shipped client 的隔离检查、13 项 Windows 路径断言。三张对照截图使用同一离线样例，没有付费模型调用。此次没有重新执行完整上游构建和测试套件。Client 在精确的既有渲染入口做局部生成包修改，上游旧 source map 不再挂载；src 中包含同等修复。

## 发布包 SHA256

- `dsh-better-display-0.3.4.tgz`: `fe0ce3e0019d1bec97b70c090af354ef1f27fbc6ab274dc6831575178c4bd16d`
- `dsh-better-display-0.3.4-yishu.reader.1.tgz`: `3266c531880ddf69048b04463c1476c0a2439126e9ceae417f01ec1d609c2b28`
