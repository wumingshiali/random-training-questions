"use strict";

/**
 * 随机训练题高亮 —— 内容脚本
 * 在页面里找到两类可点击目标：
 *   1. 指向 /problemset/problem/xxx 的链接
 *   2. 运行 pm1 JS 函数的元素（<a href="javascript:..."> 或任意带 onclick 调用 pm1 的元素，如 <td onclick="pm1('4011')">）
 * 随机选一个并加黄色高亮。
 */

const STYLE_ID = "rtq-style";
const HIGHLIGHT_CLASS = "rtq-highlight";

// 匹配 /problemset/problem/xxx 链接
function isProblemLink(el) {
  const href = (el.getAttribute && el.getAttribute("href")) || "";
  return href.includes("/problemset/problem/");
}

// 匹配运行 pm1 JS 函数的元素
function isPm1Link(el) {
  const href = ((el.getAttribute && el.getAttribute("href")) || "").trim();
  const onclick = ((el.getAttribute && el.getAttribute("onclick")) || "").trim();
  return (/^javascript:/i.test(href) && /pm1/i.test(href)) || /pm1/i.test(onclick);
}

// 收集所有符合条件的候选元素
function getCandidates() {
  const anchors = Array.from(document.querySelectorAll("a"));
  const onclickElements = Array.from(document.querySelectorAll("[onclick]"));
  const seen = new Set();
  const candidates = [];
  for (const el of anchors.concat(onclickElements)) {
    if (seen.has(el)) {
      continue;
    }
    seen.add(el);
    if (isProblemLink(el) || isPm1Link(el)) {
      candidates.push(el);
    }
  }
  return candidates;
}

// 注入高亮样式（只注入一次）
function injectStyle() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      background-color: #ffeb3b !important;
      color: #000 !important;
      outline: 2px solid #f9a825 !important;
      box-shadow: 0 0 6px rgba(249, 168, 37, 0.9) !important;
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
}

// 清除上一次的高亮
function clearHighlight() {
  document
    .querySelectorAll(`.${HIGHLIGHT_CLASS}`)
    .forEach((el) => el.classList.remove(HIGHLIGHT_CLASS));
}

// 随机选一个元素并高亮，返回是否选中
function pickRandom() {
  const candidates = getCandidates();
  if (candidates.length === 0) {
    return false;
  }
  clearHighlight();
  injectStyle();
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  chosen.classList.add(HIGHLIGHT_CLASS);
  chosen.scrollIntoView({ block: "center", behavior: "smooth" });
  return true;
}

// 页面加载完成后自动随机选一次
pickRandom();

// 点击工具栏按钮时重新随机选一次
if (typeof browser !== "undefined" && browser.runtime && browser.runtime.onMessage) {
  browser.runtime.onMessage.addListener((message) => {
    if (message && message.type === "rtq-pick-random") {
      pickRandom();
    }
  });
}
