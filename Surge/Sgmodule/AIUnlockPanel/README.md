# AI 服务解锁检测（Surge）

一个 Surge 面板，分别检测 ChatGPT、Gemini、Claude、Copilot、Perplexity 与 Grok 实际命中的 Surge 策略及出口地区。

## 安装

在 Surge 中通过下列地址安装模块：

```text
https://raw.githubusercontent.com/PANGPANGDigital/ProxyToolkit/main/Surge/Sgmodule/AIUnlockPanel/AIUnlockPanel.sgmodule
```

启用后，在 Surge 的**策略组 / Policy Selection**页面会先显示“AI 服务解锁 / 点击卡片开始检测”。点击卡片即可刷新。面板每小时会自动更新一次。

## 结果含义

每项服务显示三种结果：`🇺🇸 US` 表示该服务实际命中的策略出口地区，且地区规则通常支持该服务；`❌` 表示该地区不在内置规则内；`❓` 表示无法读取该服务的匹配策略或出口地区。它不测试账号登录、订阅、付款资格或 IP 风控。

每次刷新先向每个服务的自身域名发起轻量请求，再从 Surge 内部最近请求记录读取其实际 `policyName`，最后用该策略查询出口地区。地区政策可能变化；面板结果应作为网络检测提示，而非账号可用性保证。
