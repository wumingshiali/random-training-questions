# 随机训练题高亮（Firefox 拓展）

一个非常简单的 Firefox 拓展：随机选中当前页面里符合条件的链接，并用**黄色**标记出来。

## 功能

- 自动扫描页面元素，候选条件（满足其一即可）：
  1. `href` 包含 `/problemset/problem/` 的链接（例如 Codeforces 题目链接）
  2. 运行 `pm1` JS 函数的元素，例如：
     - `<a href="javascript:pm1(1001)">`（`javascript:` 协议 + `pm1`）
     - `<a onclick="pm1(1001)">` 或任意带 `onclick` 调用 `pm1` 的元素，如一本通的
       `<td onclick="pm1('4011')" style="cursor: pointer;">【GESP2306四级】幸运数</td>`
- 从所有候选中**随机选一个**，加黄色背景高亮，并滚动到可见位置
- 点击工具栏按钮可以**重新随机选一个**，无需刷新页面

## 安装（临时加载）

1. 打开 Firefox，地址栏输入 `about:debugging#/runtime/this-firefox`
2. 点击「临时载入附加组件」
3. 选择本目录下的 `extension/manifest.json`
4. 打开任意包含上述链接的页面即可看到效果（如 Codeforces problemset 页面）

## 打包（可选）

把 `extension` 目录内容打成 zip 即可分发：

```powershell
Compress-Archive -Path extension/* -DestinationPath random-training-questions.zip
```

## 测试

仓库内提供 `test/test.html`，可快速验证高亮逻辑：

```powershell
python -m http.server 8000
```

然后访问 <http://localhost:8000/test/test.html>，刷新页面应看到一个黄色高亮的链接，点击工具栏按钮会随机换一个。

## 文件结构

```
extension/
  manifest.json    # Manifest V2 配置（Firefox 完整支持）
  content.js       # 扫描 + 随机选择 + 黄色高亮
  background.js    # 工具栏按钮：通知页面重新随机
  icons/icon-48.png
test/
  test.html        # 本地测试页
```

