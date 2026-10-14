(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const copy = {
    zh: {
      offline: "仅在本地处理",
      skip: "跳转到回放",
      eyebrow: "AI SESSION REPLAY",
      headline: "回到问题发生的那一步",
      recordedUsage: "日志记录值",
      previous: "上一步",
      next: "下一步",
      position: "回放位置",
      heading: "会话回放",
      subtitle: "回放执行过程，找到重复调用与失败，再对照下一次运行",
      import: "打开运行记录",
      export: "保存回放 ↗",
      original: "原始运行",
      revised: "对照运行",
      replay: "执行回放",
      compare: "运行对比",
      events: "执行轨道",
      recordedSteps: "条执行记录",
      findings: "诊断提示",
      ledger: "Token 用量",
      portable: "一份文件，完整复盘",
      portableDescription: "运行记录留在浏览器里，保存后可离线回放",
      footer: "Agent Rewind · 回放记录，不执行命令",
      exportJson: "导出 JSON ↗",
      recordedOnly: "只回放已记录的步骤",
      copy: "复制内容",
      synthetic: "合成数据",
      imported: "导入报告",
      toolCalls: "工具调用",
      failedCalls: "失败调用",
      changedFiles: "修改文件",
      inputTokens: "输入 token",
      all: "全部",
      tool: "工具",
      file: "文件",
      message: "输出",
      error: "错误",
      note: "记录",
      completed: "完成",
      failed: "失败",
      in_progress: "执行中",
      unknown: "未知",
      empty: "没有匹配的记录",
      search: "搜索执行记录…",
      play: "▶ 播放",
      pause: "Ⅱ 暂停",
      line: "日志行",
      step: "步骤",
      duration: "耗时",
      input: "调用内容",
      output: "返回结果",
      noOutput: "日志没有记录返回内容",
      noText: "该事件没有记录文本",
      noFindings: "当前记录没有触发诊断提示",
      repeated: "相同调用反复出现",
      repeatedDetail: "共 {count} 次，其中 {failed} 次失败",
      large: "单次工具输出较大",
      largeDetail: "原始输出 {bytes}，点击查看对应调用",
      failedTitle: "调用失败",
      failedDetail: "查看命令、返回内容和退出码",
      cached: "其中缓存输入",
      outputTokens: "输出 token",
      usageNote: "已记录 {known}/{total} 轮用量，未提供的字段显示 —",
      bytesNote: "输出长度不等于 token 用量",
      compareTitle: "两次运行，逐项对照",
      compareSubtitle: "数字来自两份日志，展示已记录的差异",
      metric: "指标",
      delta: "变化",
      noCompare: "需要在命令行使用 --compare，或导入带对照运行的报告",
      copied: "已复制",
      copyFailed: "当前浏览器无法复制，请手动选择内容",
      saved: "离线报告已保存",
      invalid: "报告格式不正确，请导入 Agent Rewind 生成的 JSON",
      tooLarge: "报告超过 16 MiB 上限",
      outputClipped: "仅展示前 16,384 个字符",
      lineLabel: "行 {first}–{last}",
      sequence: "序号 {n}",
      limited: "显示前 300 条匹配记录",
      source: "Codex JSONL",
      tokenUnknown: "日志未提供用量",
      timingUnknown: "原始日志未记录时间戳",
      compareSample: "合成记录的运行差异",
      repeatTitle: "重复调用对比",
      repeatNote: "按工具与完整输入匹配，显示任一运行中已结束调用达到 3 次的组",
      repeatSearch: "搜索调用内容…",
      repeatEmpty: "没有符合条件的重复调用",
      repeatUnavailable:
        "这份旧报告没有调用匹配信息，请用最新版 CLI 重新生成两次运行的报告",
      repeatCount: "{shown}/{total} 组",
      repeatAdded: "新增",
      repeatRemoved: "未再出现",
      repeatIncreased: "次数增加",
      repeatDecreased: "次数减少",
      repeatUnchanged: "次数相同",
      repeatFailures: "{count} 次失败",
      repeatEvidence: "查看对应调用",
      repeatSource: "行 {line} · {status}",
      repeatSourceLimit:
        "显示前 {shown}/{total} 次调用，完整记录保留在回放与 JSON 中",
      repeatAbsent: "这份记录中没有相同的已结束调用",
      overallTitle: "整体变化",
    },
    en: {
      offline: "Local processing",
      skip: "Skip to replay",
      eyebrow: "AI SESSION REPLAY",
      headline: "Find the moment it went wrong",
      recordedUsage: "Recorded usage",
      previous: "Previous step",
      next: "Next step",
      position: "Replay position",
      heading: "Session replay",
      subtitle: "Replay the steps, follow a failure, compare the next run",
      import: "Open a recording",
      export: "Save replay ↗",
      original: "Original run",
      revised: "Comparison run",
      replay: "Replay",
      compare: "Compare runs",
      events: "Session track",
      recordedSteps: "recorded steps",
      findings: "Findings",
      ledger: "Token usage",
      portable: "One file, the full replay",
      portableDescription:
        "Your recording stays in this browser. Save it to replay offline",
      footer: "Agent Rewind · Recorded steps, never executed commands",
      exportJson: "Export JSON ↗",
      recordedOnly: "Replay recorded steps only",
      copy: "Copy content",
      synthetic: "Synthetic data",
      imported: "Imported report",
      toolCalls: "Tool calls",
      failedCalls: "Failed calls",
      changedFiles: "Changed files",
      inputTokens: "Input tokens",
      all: "All",
      tool: "Tools",
      file: "Files",
      message: "Messages",
      error: "Errors",
      note: "Notes",
      completed: "Completed",
      failed: "Failed",
      in_progress: "In progress",
      unknown: "Unknown",
      empty: "No matching steps",
      search: "Search this recording…",
      play: "▶ Play",
      pause: "Ⅱ Pause",
      line: "Log lines",
      step: "Step",
      duration: "Duration",
      input: "Call input",
      output: "Result",
      noOutput: "No result was recorded",
      noText: "No text was recorded for this event",
      noFindings: "No diagnostic rules matched this recording",
      repeated: "The same call, again",
      repeatedDetail: "{count} calls, including {failed} failures",
      large: "Large tool output",
      largeDetail: "Original output: {bytes}. Open the recorded call",
      failedTitle: "Failed call",
      failedDetail: "Inspect the command, result and exit code",
      cached: "Cached input",
      outputTokens: "Output tokens",
      usageNote:
        "Usage recorded for {known}/{total} turns; missing fields show —",
      bytesNote: "Output bytes are not a token estimate",
      compareTitle: "Two runs, side by side",
      compareSubtitle: "Values come from the two recordings",
      metric: "Metric",
      delta: "Change",
      noCompare:
        "Use --compare in the CLI or import a report containing a comparison run",
      copied: "Copied",
      copyFailed: "Clipboard is unavailable; select and copy the text manually",
      saved: "Offline report saved",
      invalid: "Invalid report; import JSON generated by Agent Rewind",
      tooLarge: "Report exceeds the 16 MiB limit",
      outputClipped: "Showing the first 16,384 characters",
      lineLabel: "Lines {first}–{last}",
      sequence: "Step {n}",
      limited: "Showing the first 300 matching steps",
      source: "Codex JSONL",
      tokenUnknown: "Usage was not recorded",
      timingUnknown: "The original log has no timestamps",
      compareSample: "Run differences in synthetic recordings",
      repeatTitle: "Repeated calls",
      repeatNote:
        "Match the tool and full input; show groups with 3 or more finished calls in either run",
      repeatSearch: "Search call input…",
      repeatEmpty: "No repeated calls match",
      repeatUnavailable:
        "This older report has no call matching data; regenerate both runs with the latest CLI",
      repeatCount: "{shown}/{total} groups",
      repeatAdded: "New",
      repeatRemoved: "Not seen again",
      repeatIncreased: "More calls",
      repeatDecreased: "Fewer calls",
      repeatUnchanged: "Same count",
      repeatFailures: "{count} failures",
      repeatEvidence: "Inspect recorded calls",
      repeatSource: "Line {line} · {status}",
      repeatSourceLimit:
        "Showing {shown}/{total} calls; replay and JSON retain the full recording",
      repeatAbsent: "No matching finished calls in this recording",
      overallTitle: "Overall totals",
    },
  };
  let locale = "zh";
  try {
    locale =
      localStorage.getItem("independent-tools.locale") === "en" ? "en" : "zh";
  } catch {}
  const t = (key, values = {}) =>
    Object.entries(values).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      copy[locale][key] ?? key,
    );
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const number = (value) =>
    value === null || value === undefined
      ? "—"
      : Number(value).toLocaleString(locale === "zh" ? "zh-CN" : "en-US");
  const bytes = (value) =>
    Number(value) < 1024
      ? `${number(value)} B`
      : `${(Number(value) / 1024).toFixed(1)} KiB`;
  const icon = (kind) =>
    ({ tool: "⌘", file: "▤", message: "≡", error: "!", note: "·" })[kind] ??
    "·";
  function validate(data, depth = 0) {
    if (
      depth > 1 ||
      data?.schema !== "agent-rewind/v1" ||
      !Array.isArray(data.events) ||
      data.events.length > 20000 ||
      !data.summary?.usage ||
      !Array.isArray(data.findings) ||
      !Array.isArray(data.turns)
    )
      throw Error(t("invalid"));
    const ids = new Set();
    const integer = (v) => Number.isSafeInteger(v) && v >= 0;
    if (
      !["title", "source", "thread_id"].every(
        (k) => typeof data[k] === "string",
      ) ||
      !Array.isArray(data.warnings) ||
      ![
        "events",
        "tool_calls",
        "failed_calls",
        "files_changed",
        "turns",
        "usage_turns",
        "output_bytes",
      ].every((k) => integer(data.summary[k])) ||
      !["input_tokens", "cached_input_tokens", "output_tokens"].every(
        (k) => data.summary.usage[k] === null || integer(data.summary.usage[k]),
      )
    )
      throw Error(t("invalid"));
    for (const e of data.events) {
      if (
        !e ||
        !["id", "kind", "status", "title", "input", "output", "text"].every(
          (k) => typeof e[k] === "string",
        ) ||
        ids.has(e.id) ||
        !Array.isArray(e.paths)
      )
        throw Error(t("invalid"));
      if (
        !e.paths.every(
          (p) =>
            p && typeof p.path === "string" && typeof p.action === "string",
        )
      )
        throw Error(t("invalid"));
      if (
        !["tool", "file", "message", "error", "note"].includes(e.kind) ||
        !["completed", "failed", "in_progress", "unknown"].includes(e.status) ||
        !["source_line", "end_line", "order"].every((k) => integer(e[k])) ||
        !["at_ms", "duration_ms"].every(
          (k) =>
            e[k] === null ||
            (typeof e[k] === "number" && Number.isFinite(e[k])),
        )
      )
        throw Error(t("invalid"));
      ids.add(e.id);
    }
    if (
      !data.findings.every(
        (f) =>
          f &&
          ["repeated_call", "large_output", "failed_call"].includes(f.code) &&
          Array.isArray(f.event_ids) &&
          f.event_ids.every((id) => ids.has(id)),
      )
    )
      throw Error(t("invalid"));
    if (data.call_groups !== undefined) {
      const grouped = data.call_groups;
      if (
        grouped?.scheme !== "exact-tool-input/v1" ||
        !Array.isArray(grouped.groups) ||
        grouped.groups.length > data.events.length
      )
        throw Error(t("invalid"));
      const finished = new Map(
        data.events
          .filter(
            (e) =>
              e.kind === "tool" && ["completed", "failed"].includes(e.status),
          )
          .map((e) => [e.id, e]),
      );
      const covered = new Set(),
        fingerprints = new Set();
      for (const g of grouped.groups) {
        if (
          !g ||
          typeof g.fingerprint !== "string" ||
          !/^[a-f0-9]{64}$/.test(g.fingerprint) ||
          fingerprints.has(g.fingerprint) ||
          !integer(g.count) ||
          g.count < 1 ||
          !integer(g.failed) ||
          g.failed > g.count ||
          !Array.isArray(g.event_ids) ||
          g.event_ids.length !== g.count
        )
          throw Error(t("invalid"));
        let failures = 0;
        for (const id of g.event_ids) {
          const event = finished.get(id);
          if (!event || covered.has(id)) throw Error(t("invalid"));
          covered.add(id);
          if (event.status === "failed") failures++;
        }
        if (failures !== g.failed) throw Error(t("invalid"));
        fingerprints.add(g.fingerprint);
      }
      if (covered.size !== finished.size) throw Error(t("invalid"));
    }
    if (data.comparison) validate(data.comparison, depth + 1);
    return data;
  }
  const firstStep = (data) =>
    Math.max(
      0,
      data.events.findIndex((e) => e.status === "failed"),
    );
  let primary = validate(JSON.parse($("report-data").textContent));
  let report = primary,
    cursor = firstStep(primary),
    filter = "all",
    query = "",
    mode = "replay",
    timer = null,
    repeatQuery = "";
  const name = (data) => data.title_i18n?.[locale] ?? data.title;
  let toastTimer;
  function toast(text) {
    $("toast").textContent = text;
    $("toast").classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 2600);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
    $("play").textContent = t("play");
  }
  function choose(index) {
    const trackFocused = document.activeElement?.matches(
      "#event-list [data-step]",
    );
    cursor = Math.max(0, Math.min(report.events.length - 1, index));
    renderReplay();
    scrollSelection();
    if (trackFocused)
      $("event-list").querySelector(".active")?.focus({ preventScroll: true });
  }
  function scrollSelection() {
    const row = $("event-list").querySelector(".active");
    if (row) {
      const bounds = $("event-list").getBoundingClientRect();
      const rect = row.getBoundingClientRect();
      if (rect.left < bounds.left)
        $("event-list").scrollLeft -= bounds.left - rect.left + 12;
      else if (rect.right > bounds.right)
        $("event-list").scrollLeft += rect.right - bounds.right + 12;
    }
  }
  function summary() {
    const s = report.summary;
    const values = [
      ["toolCalls", s.tool_calls],
      ["failedCalls", s.failed_calls],
      ["changedFiles", s.files_changed],
      ["inputTokens", s.usage.input_tokens],
    ];
    $("metrics").innerHTML = values
      .map(
        ([key, value]) =>
          `<article class="metric metric-${key}"><strong>${esc(number(value))}</strong><span class="metric-label">${esc(t(key))}</span></article>`,
      )
      .join("");
    $("session-title").textContent = name(report);
    $("sample-badge").textContent = t(
      report.synthetic ? "synthetic" : "imported",
    );
    $("source-label").textContent = t("source");
    $("original").classList.toggle("active", report === primary);
    $("revised").classList.toggle("active", report !== primary);
    $("revised").disabled = !primary.comparison;
    $("revised").title = primary.comparison ? "" : t("noCompare");
    $("compare-tab").disabled = !primary.comparison;
    $("compare-tab").title = primary.comparison ? "" : t("noCompare");
    $("report-note").textContent = report.events.some((e) => e.at_ms !== null)
      ? `${report.events.length} ${t("recordedSteps")}`
      : t("timingUnknown");
  }
  function renderList() {
    const savedScroll = $("event-list").scrollLeft;
    const matches = report.events
      .map((e, index) => ({ e, index }))
      .filter(
        ({ e }) =>
          (filter === "all" ||
            e.kind === filter ||
            (filter === "error" && e.status === "failed")) &&
          `${e.title}\n${e.input}\n${e.output}\n${e.text}\n${e.paths.map((p) => p.path).join(" ")}`
            .toLowerCase()
            .includes(query),
      );
    $("event-count").textContent = `${matches.length}/${report.events.length}`;
    $("event-list").innerHTML =
      matches
        .slice(0, 300)
        .map(
          ({ e, index }) =>
            `<button class="event-row ${index === cursor ? "active" : ""}" data-step="${index}" aria-current="${index === cursor ? "step" : "false"}"><span class="event-icon ${esc(e.status)}">${icon(e.kind)}</span><span class="step-number">${String(index + 1).padStart(2, "0")}</span><span class="event-info"><strong>${esc(e.kind === "file" ? e.paths.map((p) => p.path).join(", ") || t("file") : e.kind === "message" ? e.text.split("\n")[0] || t("message") : e.title)}</strong><small>${esc(e.at_ms === null ? t("sequence", { n: e.order }) : `${(Number(e.at_ms) / 1000).toFixed(1)}s`)} · ${esc(t(e.kind))}</small></span><i class="status-dot ${esc(e.status)}"></i></button>`,
        )
        .join("") || `<div class="empty">${esc(t("empty"))}</div>`;
    $("event-list").scrollLeft = savedScroll;
    $("event-list")
      .querySelectorAll("[data-step]")
      .forEach(
        (button) =>
          (button.onclick = () => {
            stop();
            choose(Number(button.dataset.step));
          }),
      );
    $("list-note").textContent =
      matches.length > 300
        ? t("limited")
        : `${number(report.events.length)} ${t("recordedSteps")}`;
  }
  function renderDetail() {
    const e = report.events[cursor];
    $("play").disabled = !e;
    $("copy").disabled = !e;
    $("scrubber").disabled = !e;
    if (!e) {
      $("step-label").textContent = `${t("step")} 0 / 0`;
      $("previous").disabled = true;
      $("next").disabled = true;
      $("scrubber").max = 0;
      $("scrubber").value = 0;
      $("detail-title").textContent = t("empty");
      $("detail-status").textContent = "";
      $("detail-meta").textContent = "";
      $("detail-body").innerHTML =
        `<div class="empty">${esc(t("empty"))}</div>`;
      return;
    }
    $("detail-icon").textContent = icon(e.kind);
    $("detail-title").textContent = ["file", "message", "note"].includes(e.kind)
      ? t(e.kind)
      : e.title;
    $("detail-status").textContent = t(e.status);
    $("detail-status").className =
      `pill ${["completed", "failed", "in_progress"].includes(e.status) ? e.status : ""}`;
    $("detail-meta").innerHTML =
      `<span>${esc(t("lineLabel", { first: e.source_line, last: e.end_line }))}</span><span>${esc(t("duration"))}: ${e.duration_ms === null ? "—" : esc(`${(Number(e.duration_ms) / 1000).toFixed(2)}s`)}</span>${e.exit_code !== undefined ? `<span>Exit ${esc(number(e.exit_code))}</span>` : ""}`;
    if (e.kind === "tool") {
      $("detail-body").innerHTML =
        `<div class="call-columns"><section><div class="code-title"><span>${esc(t("input"))}</span><span>${esc(e.tool_name)}</span></div><div class="terminal"><div class="terminal-bar"><i></i><i></i><i></i><span>${esc(e.tool_name || "tool")}</span></div><pre><span class="prompt">› </span>${esc(e.input || e.title)}</pre></div></section><section><div class="output-label"><span>${esc(t("output"))}</span><span class="muted">${esc(bytes(e.output_bytes ?? 0))}</span></div><div class="output-text">${esc(e.output || t("noOutput"))}</div></section></div>${e.truncated ? `<p class="token-note">${esc(t("outputClipped"))}</p>` : ""}`;
    } else if (e.kind === "file") {
      $("detail-body").innerHTML =
        e.paths
          .map(
            (p) =>
              `<div class="file-row"><span class="pill blue">${esc(p.action)}</span><strong>${esc(p.path)}</strong></div>`,
          )
          .join("") || `<div class="empty">${esc(t("noText"))}</div>`;
    } else
      $("detail-body").innerHTML =
        `<div class="message-text">${esc(e.text || t("noText"))}</div>`;
    $("step-label").textContent =
      `${t("step")} ${cursor + 1} / ${report.events.length}`;
    $("scrubber").max = Math.max(0, report.events.length - 1);
    $("scrubber").value = cursor;
    $("previous").disabled = cursor === 0;
    $("next").disabled = cursor >= report.events.length - 1;
  }
  function renderFindings() {
    $("finding-count").textContent = report.findings.length;
    $("finding-list").innerHTML =
      report.findings
        .map((f, index) => {
          const title =
            f.code === "repeated_call"
              ? t("repeated")
              : f.code === "large_output"
                ? t("large")
                : t("failedTitle");
          const detail =
            f.code === "repeated_call"
              ? t("repeatedDetail", f)
              : f.code === "large_output"
                ? t("largeDetail", { bytes: bytes(f.bytes) })
                : t("failedDetail");
          return `<button class="finding" data-finding="${index}"><strong><span><span class="finding-mark">!</span>${esc(title)}</span><span class="arrow">↗</span></strong><p>${esc(detail)}</p></button>`;
        })
        .join("") || `<div class="empty">${esc(t("noFindings"))}</div>`;
    $("finding-list")
      .querySelectorAll("[data-finding]")
      .forEach(
        (button) =>
          (button.onclick = () => {
            stop();
            filter = "all";
            query = "";
            $("search").value = "";
            const f = report.findings[Number(button.dataset.finding)];
            const index = report.events.findIndex((e) =>
              f.event_ids.includes(e.id),
            );
            if (index >= 0) choose(index);
            renderFilters();
          }),
      );
    const usage = report.summary.usage;
    const ratio =
      usage.input_tokens > 0 && usage.cached_input_tokens !== null
        ? Math.min(100, (usage.cached_input_tokens / usage.input_tokens) * 100)
        : 0;
    $("token-ledger").innerHTML =
      [
        ["inputTokens", usage.input_tokens],
        ["cached", usage.cached_input_tokens],
        ["outputTokens", usage.output_tokens],
      ]
        .map(
          ([key, value]) =>
            `<div class="ledger-row"><span>${esc(t(key))}</span><strong>${esc(number(value))}</strong></div>`,
        )
        .join("") +
      `<div class="token-bar"><i style="width:${ratio}%"></i></div><p class="token-note">${esc(t("usageNote", { known: report.summary.usage_turns, total: report.summary.turns }))}<br>${esc(t("bytesNote"))}</p>`;
  }
  function renderFilters() {
    $("filters").innerHTML = ["all", "tool", "file", "error"]
      .map(
        (key) =>
          `<button data-filter="${key}" aria-pressed="${filter === key}" class="${filter === key ? "active" : ""}">${esc(t(key))}</button>`,
      )
      .join("");
    $("filters")
      .querySelectorAll("button")
      .forEach(
        (button) =>
          (button.onclick = () => {
            filter = button.dataset.filter;
            renderFilters();
            renderList();
          }),
      );
  }
  function renderReplay() {
    renderList();
    renderDetail();
  }
  function repeatedGroups() {
    const other = primary.comparison;
    if (!primary.call_groups || !other?.call_groups) return null;
    const events = [primary, other].map(
      (data) => new Map(data.events.map((e) => [e.id, e])),
    );
    const merged = new Map();
    [primary, other].forEach((data, run) => {
      for (const group of data.call_groups.groups) {
        if (!merged.has(group.fingerprint))
          merged.set(group.fingerprint, [null, null]);
        merged.get(group.fingerprint)[run] = group;
      }
    });
    const changes = {
      repeatAdded: 0,
      repeatIncreased: 1,
      repeatUnchanged: 2,
      repeatDecreased: 3,
      repeatRemoved: 4,
    };
    return Array.from(merged.values())
      .filter(([a, b]) => Math.max(a?.count ?? 0, b?.count ?? 0) >= 3)
      .map(([a, b]) => {
        const before = a?.count ?? 0,
          after = b?.count ?? 0;
        const change = !a
          ? "repeatAdded"
          : !b
            ? "repeatRemoved"
            : after > before
              ? "repeatIncreased"
              : after < before
                ? "repeatDecreased"
                : "repeatUnchanged";
        const event = a
          ? events[0].get(a.event_ids[0])
          : events[1].get(b.event_ids[0]);
        return {
          a,
          b,
          before,
          after,
          change,
          title: event.title,
          input: event.input,
          delta: after - before,
        };
      })
      .sort(
        (a, b) =>
          changes[a.change] - changes[b.change] ||
          Math.abs(b.delta) - Math.abs(a.delta) ||
          a.title.localeCompare(b.title),
      );
  }
  function jumpToCall(run, id) {
    const target = run === "0" ? primary : primary.comparison;
    const index = target.events.findIndex((e) => e.id === id);
    if (index < 0) return;
    stop();
    report = target;
    cursor = index;
    filter = "all";
    query = "";
    mode = "replay";
    $("search").value = "";
    render();
    $("replay-view").scrollIntoView({ block: "start" });
    $("replay-view").focus({ preventScroll: true });
  }
  function renderRepeated() {
    const container = $("repeat-list");
    if (!container) return;
    const groups = repeatedGroups();
    if (groups === null) {
      container.innerHTML = `<p class="repeat-empty">${esc(t("repeatUnavailable"))}</p>`;
      $("repeat-search").hidden = true;
      $("repeat-count").textContent = "";
      return;
    }
    $("repeat-search").hidden = false;
    const matched = groups.filter((g) =>
      `${g.title}\n${g.input}`.toLowerCase().includes(repeatQuery),
    );
    const shown = matched.slice(0, 100);
    $("repeat-count").textContent = t("repeatCount", {
      shown: shown.length,
      total: matched.length,
    });
    container.innerHTML =
      shown
        .map((g, index) => {
          const delta = `${g.delta > 0 ? "+" : ""}${number(g.delta)}`;
          return `<article class="repeat-group" data-repeat-group="${index}">
        <div class="repeat-label"><span class="repeat-change ${g.change}">${esc(t(g.change))}</span><strong>${esc(g.title)}</strong></div>
        ${g.input && g.input !== g.title ? `<p class="repeat-input">${esc(g.input.slice(0, 400))}</p>` : ""}
        <div class="repeat-counts"><div><span>${esc(t("original"))}</span><strong>${number(g.before)}</strong><small>${esc(t("repeatFailures", { count: g.a?.failed ?? 0 }))}</small></div>
        <div><span>${esc(t("revised"))}</span><strong>${number(g.after)}</strong><small>${esc(t("repeatFailures", { count: g.b?.failed ?? 0 }))}</small></div>
        <div class="repeat-delta"><span>${esc(t("delta"))}</span><strong>${esc(delta)}</strong></div></div>
        <details class="repeat-evidence"><summary>${esc(t("repeatEvidence"))}</summary><div class="repeat-source-columns"></div></details></article>`;
        })
        .join("") || `<p class="repeat-empty">${esc(t("repeatEmpty"))}</p>`;
    const indexes = [primary, primary.comparison].map(
      (data) => new Map(data.events.map((e) => [e.id, e])),
    );
    container.querySelectorAll("details").forEach((details, index) => {
      details.ontoggle = () => {
        const body = details.querySelector(".repeat-source-columns");
        if (!details.open || body.childElementCount) return;
        const g = shown[index];
        body.innerHTML = [g.a, g.b]
          .map((group, run) => {
            const ids = group?.event_ids ?? [],
              visible = ids.slice(0, 30);
            return `<section><h4>${esc(t(run ? "revised" : "original"))}</h4>${
              visible
                .map((id) => {
                  const e = indexes[run].get(id);
                  return `<button class="repeat-source" data-call-run="${run}" data-call-id="${esc(id)}">${esc(t("repeatSource", { line: e.source_line, status: t(e.status) }))}<span aria-hidden="true">↗</span></button>`;
                })
                .join("") ||
              `<p class="repeat-empty">${esc(t("repeatAbsent"))}</p>`
            }${ids.length > 30 ? `<p class="repeat-limit">${esc(t("repeatSourceLimit", { shown: 30, total: ids.length }))}</p>` : ""}</section>`;
          })
          .join("");
        body.querySelectorAll("[data-call-id]").forEach((button) => {
          button.onclick = () =>
            jumpToCall(button.dataset.callRun, button.dataset.callId);
        });
      };
    });
  }
  function renderCompare() {
    const other = primary.comparison;
    if (!other) {
      $("compare-view").replaceChildren();
      return;
    }
    const fields = [
      ["toolCalls", "tool_calls"],
      ["failedCalls", "failed_calls"],
      ["changedFiles", "files_changed"],
      ["inputTokens", "input_tokens"],
      ["outputTokens", "output_tokens"],
    ];
    const get = (data, key) =>
      key.endsWith("tokens") ? data.summary.usage[key] : data.summary[key];
    $("compare-view").innerHTML =
      `<h2>${esc(t("compareTitle"))}</h2><p>${esc(primary.synthetic && other.synthetic ? t("compareSample") : t("compareSubtitle"))}</p><section class="repeat-comparison" aria-labelledby="repeat-title"><div class="repeat-heading"><h3 id="repeat-title">${esc(t("repeatTitle"))}</h3><span id="repeat-count" class="count" aria-live="polite"></span></div><p class="repeat-note">${esc(t("repeatNote"))}</p><input type="search" id="repeat-search" value="${esc(repeatQuery)}" placeholder="${esc(t("repeatSearch"))}" aria-label="${esc(t("repeatSearch"))}" autocomplete="off"><div id="repeat-list"></div></section><h3 class="overall-heading">${esc(t("overallTitle"))}</h3><div class="comparison-metrics" role="region" aria-label="${esc(t("overallTitle"))}" tabindex="0"><table><thead><tr><th>${esc(t("metric"))}</th><th>${esc(name(primary))}</th><th>${esc(name(other))}</th><th>${esc(t("delta"))}</th></tr></thead><tbody>${fields
        .map(([label, key]) => {
          const a = get(primary, key),
            b = get(other, key);
          const delta =
            a === null || b === null
              ? "—"
              : `${b - a > 0 ? "+" : ""}${number(b - a)}`;
          return `<tr><td>${esc(t(label))}</td><td>${esc(number(a))}</td><td>${esc(number(b))}</td><td class="delta">${esc(delta)}</td></tr>`;
        })
        .join("")}</tbody></table></div>`;
    $("repeat-search").oninput = (event) => {
      repeatQuery = event.target.value.toLowerCase();
      renderRepeated();
    };
    renderRepeated();
  }
  function render() {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = `Agent Rewind · ${t("heading")}`;
    document
      .querySelectorAll("[data-i18n]")
      .forEach((node) => (node.textContent = t(node.dataset.i18n)));
    $("language").textContent = locale === "zh" ? "English" : "中文";
    $("language").setAttribute(
      "aria-label",
      locale === "zh" ? "Switch to English" : "切换为中文",
    );
    $("previous").setAttribute("aria-label", t("previous"));
    $("next").setAttribute("aria-label", t("next"));
    $("scrubber").setAttribute("aria-label", t("position"));
    $("search").placeholder = t("search");
    $("search").setAttribute("aria-label", t("search"));
    $("play").textContent = t(timer ? "pause" : "play");
    summary();
    renderFilters();
    renderReplay();
    renderFindings();
    renderCompare();
    $("replay-view").hidden = mode !== "replay";
    $("compare-view").hidden = mode !== "compare";
    $("replay-tab").setAttribute("aria-pressed", String(mode === "replay"));
    $("compare-tab").setAttribute("aria-pressed", String(mode === "compare"));
    $("replay-tab").classList.toggle("active", mode === "replay");
    $("compare-tab").classList.toggle("active", mode === "compare");
    if (mode === "replay") scrollSelection();
  }
  function download(content, type, filename) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $("language").onclick = () => {
    locale = locale === "zh" ? "en" : "zh";
    try {
      localStorage.setItem("independent-tools.locale", locale);
    } catch {}
    render();
  };
  $("search").oninput = (event) => {
    query = event.target.value.toLowerCase();
    renderList();
  };
  $("scrubber").oninput = (event) => {
    stop();
    choose(Number(event.target.value));
  };
  $("previous").onclick = () => {
    stop();
    choose(cursor - 1);
  };
  $("next").onclick = () => {
    stop();
    choose(cursor + 1);
  };
  $("play").onclick = () => {
    if (timer) {
      stop();
      return;
    }
    if (cursor >= report.events.length - 1) cursor = -1;
    timer = setInterval(() => {
      if (cursor >= report.events.length - 1) {
        stop();
        return;
      }
      choose(cursor + 1);
    }, 850);
    $("play").textContent = t("pause");
  };
  $("original").onclick = () => {
    stop();
    report = primary;
    cursor = firstStep(report);
    render();
  };
  $("revised").onclick = () => {
    if (!primary.comparison) return;
    stop();
    report = primary.comparison;
    cursor = firstStep(report);
    render();
  };
  $("replay-tab").onclick = () => {
    mode = "replay";
    render();
  };
  $("compare-tab").onclick = () => {
    if (primary.comparison) {
      stop();
      mode = "compare";
      render();
    }
  };
  $("copy").onclick = async () => {
    const e = report.events[cursor];
    if (!e) return;
    try {
      await navigator.clipboard.writeText(
        e.input || e.text || e.paths.map((p) => p.path).join("\n"),
      );
      toast(t("copied"));
    } catch {
      toast(t("copyFailed"));
    }
  };
  $("import").onclick = () => $("file").click();
  $("file").onchange = async () => {
    const file = $("file").files[0];
    if (!file) return;
    try {
      if (file.size > 16 * 1024 * 1024) throw Error(t("tooLarge"));
      const data = validate(JSON.parse(await file.text()));
      stop();
      primary = data;
      report = data;
      cursor = firstStep(report);
      filter = "all";
      query = "";
      mode = "replay";
      repeatQuery = "";
      $("search").value = "";
      render();
    } catch (error) {
      toast(error.message || t("invalid"));
    } finally {
      $("file").value = "";
    }
  };
  $("json-export").onclick = () =>
    download(
      JSON.stringify(primary, null, 2),
      "application/json",
      "agent-rewind-report.json",
    );
  $("export").onclick = () => {
    stop();
    const clone = document.documentElement.cloneNode(true);
    clone.querySelector("#report-data").textContent = JSON.stringify(
      primary,
    ).replaceAll("<", "\\u003c");
    clone.querySelector("#toast").classList.remove("visible");
    download(
      "<!doctype html>\n" + clone.outerHTML,
      "text/html",
      "agent-rewind-report.html",
    );
    toast(t("saved"));
  };
  render();
})();
