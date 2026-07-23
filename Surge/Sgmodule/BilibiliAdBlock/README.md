# Bilibili 增强 Surge 模块

基于 kokoryh/Sparkle 的 bilibili 规则适配，包含广告净化、会员标识、评论区优化、空降助手、青少年模式关闭等功能。

## 功能

- 拦截广告域名与直播购物信息
- 青少年模式默认关闭
- 默认搜索词净化
- 评论区过滤置顶广告、优化加载
- 空降助手（SponsorBlock）
- 会员到期标识
- 动态/首页/播放页等更多 JSON 与 Protobuf 改写

## 使用

在 Surge 中导入 `BilibiliEnhance.sgmodule`，并启用 HTTPS 解密（MITM）。首次使用时，按 Surge 提示安装并信任其 CA 证书。

本模块依赖远程脚本，需确保设备可访问 GitHub。Bilibili 接口变更后，个别规则可能失效或需要更新。

要求：
- Surge 版本 ≥ 5.0（支持 `http-response-jq` 与 `[Header Rewrite]`）
- 文件编码为 UTF-8（无 BOM）

## 来源与许可

规则依据：

- [5gpn bilibili-cleaner](https://github.com/moooyo/5gpn-extensions/tree/main/bilibili-cleaner)
- [kokoryh/Sparkle](https://github.com/kokoryh/Sparkle/blob/master/src/script/bilibili/README.md)

上游扩展标注为 GPL-3.0-only，本模块同样以 GPL-3.0-only 提供。完整许可文本见 [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)。
