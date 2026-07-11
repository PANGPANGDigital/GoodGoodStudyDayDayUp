# AI Unlock Panel for Surge

这是一个 Surge 信息面板，用出口 IP 的国家/地区判断常见 AI 网页服务的**地区可用性**：ChatGPT、Gemini、Claude、Copilot、Perplexity 和 Grok。

它不访问账号、不验证订阅，也不能保证服务当下没有风控或故障；`✓` 只表示该出口地区按内置规则通常可使用。出口地区来自 Cloudflare trace，面板不会发送其他探测请求。

## 安装

将 [AIUnlockPanel.sgmodule](AIUnlockPanel.sgmodule) 与 [AIUnlockPanel.js](AIUnlockPanel.js) 一并放进 Surge 配置文件所在目录，然后在 Surge 中安装/启用该本地模块。脚本路径是相对于配置文件的 `AIUnlockPanel.js`。

如果自行托管脚本，把模块中 `script-path=AIUnlockPanel.js` 改为该脚本的 HTTPS Raw URL，即可作为远程模块使用。

## 可选参数

在模块参数页（或 `[Script]` 的 `argument`）中设置：

- `title=AI%20Unlock`：面板标题
- `services=chatgpt,gemini,claude,copilot,perplexity,grok`：显示的服务；可删减或调整顺序
- `icon`、`iconcolor`：全部通过时的 SF Symbol 和颜色
- `iconerr`、`iconerrcolor`：任一服务不通过时的图标和颜色

`force-country=US` 仅供调试，会覆盖真实出口地区；正常使用请不要设置。

## 规则说明

- ChatGPT 与 Claude 使用各自的静态支持地区表。
- Gemini 使用个人网页版的排除地区规则；中国大陆的 Workspace 例外不会显示为已解锁。
- Copilot、Perplexity、Grok 没有同等粒度且稳定的消费者地区清单，采用保守的广泛可用性提示。因此它们不等于账号或付款资格检测。

地区政策会变化；维护时优先核对官方地区页面，再更新 `AIUnlockPanel.js` 中的地区表。Surge 的 `script-path` 支持相对路径、绝对路径或 URL，因而本模块可作为本地模块直接使用。[Surge 脚本说明](https://manual.nssurge.com/scripting/common.html)
