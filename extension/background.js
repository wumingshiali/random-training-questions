"use strict";

// 工具栏按钮：通知当前标签页重新随机选一个链接
browser.browserAction.onClicked.addListener((tab) => {
  if (tab && tab.id != null) {
    browser.tabs
      .sendMessage(tab.id, { type: "rtq-pick-random" })
      .catch(() => {
        // 当前页面没有内容脚本或加载失败时静默忽略
      });
  }
});
