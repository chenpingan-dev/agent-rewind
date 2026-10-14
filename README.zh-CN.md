# Agent Rewind

### 给 Codex 会话加一个回放键

[打开会话回放 →](https://chenpingan-dev.github.io/agent-rewind/) · [安装使用](#安装使用) · [English](README.md) / [简体中文](README.zh-CN.md)

Agent Rewind 是一个**本地运行的 Codex CLI 日志查看器与 AI 编码会话回放工具**，把 `codex exec --json` 导出的 JSONL 转成可搜索的 HTML 报告，用于排查失败调用、定位重复命令，并对比两次运行记录的 Token 用量

![Agent Rewind：调用内容、返回结果与执行轨道](assets/screenshot.zh-CN.png)

- **回放执行过程**：用播放控件逐步查看，也可以在轨道上直接跳转
- **定位异常调用**：从重复执行、失败和大输出提示跳到对应步骤
- **对照两次运行**：比较调用次数、失败次数与日志记录的 token 用量
- **比较重复调用**：查看哪些输入新增、增加、减少或未再出现，直接跳到两次运行中的对应步骤

![重复调用对比与两次运行的日志入口](assets/comparison.zh-CN.png)

在“运行对比”中，任一记录里已完成或失败的相同调用达到 3 次，就会进入重复调用对比。每组展示两次运行的次数、失败次数和变化；展开“查看对应调用”，可以跳到任一次调用的日志位置。搜索覆盖页面展示的标题与输入

匹配依据是工具身份与完整记录输入，在遮盖敏感内容、截断展示文本之前计算，因此外观相似的命令仍可能分为不同组。次数变化不代表重试不合理，也不表示问题已经修复。v0.1.2 之前生成的报告仍可打开，使用当前 CLI 重新生成两次运行的报告后即可启用分组对比。页面显示前 100 个匹配组，每组每次运行提供最多 30 个日志入口，回放与 JSON 保留完整记录

读取 Codex exec 导出的 JSONL，使用 Python 标准库在本地分析，报告支持中英文与离线打开

## 安装使用

需要 Python 3.11+，无需模型 API Key

```sh
git clone https://github.com/chenpingan-dev/agent-rewind.git
cd agent-rewind
python -m pip install .
agent-rewind examples/repeated-run.jsonl --compare examples/focused-run.jsonl --html replay.html --json report.json
```

浏览器打开 `replay.html` 即可回放和搜索，回放不会执行日志里的命令

用 `codex exec --json "任务描述" > session.jsonl` 导出自己的会话，再运行 `agent-rewind session.jsonl --html session.html`

前一条命令会运行 Codex，并可能修改工作区；Agent Rewind 只读取你传入的日志。页面导入的是 CLI 生成的报告 JSON，原始 JSONL 要先通过 CLI 分析

## 日志分析与会话对比的范围

在线回放和仓库内的记录使用合成数据。同一调用的生命周期会合并为一个步骤，缺失时间和用量显示 `—`，不推测成本或节省比例

重复操作可能是合理重试，诊断用于人工复查。当前仅支持 Codex exec JSONL，不读取内部会话目录，也不自动扫描其他目录

常见密钥会做尽力遮盖，分享前仍需检查文本、路径和其他敏感信息。输入上限 16 MiB / 20,000 条记录，单次输出最多展示 16,384 个字符

## 本地开发

```sh
python -m unittest discover -s tests -v
python scripts/build_demo.py
```

[界面设计](docs/design.md) · [架构](docs/architecture.md) · [路线图](docs/roadmap.md) · [参与贡献](CONTRIBUTING.md)

MIT · 独立、AI 辅助开发 · 与 OpenAI 无隶属关系
