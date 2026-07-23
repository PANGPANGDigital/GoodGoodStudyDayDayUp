# Bilibili 去广告 Surge 模块

这是一个无需远程脚本的 Surge 模块，提取自 5gpn 的 bilibili-cleaner 扩展中与广告、推广和追踪有关的规则。

覆盖范围：

- 清空开屏广告和活动素材；
- 移除首页、竖屏信息流中的广告卡片；
- 屏蔽直播购物信息、活动卡片、预约和部分追踪请求；
- 拦截 api/app.biliapi.* 广告域名及直播 P2P/追踪域名；
- 清理频道页活动横幅与皮肤推广。

模块刻意不包含会员状态伪造、付费内容修改、空降助手（SponsorBlock）、Protobuf 请求/响应改写，避免将“去广告”扩大成其它功能。

## 使用

在 Surge 中导入 BilibiliAdBlock.sgmodule，并启用 HTTPS 解密（MITM）。首次使用时，按 Surge 的提示安装并信任其 CA 证书。

本模块不引用远程脚本，因此导入后不会因第三方脚本更新而改变行为。Bilibili 接口变更后，个别规则可能失效或需要更新。

## 来源与许可

规则依据：

- [5gpn bilibili-cleaner](https://github.com/moooyo/5gpn-extensions/tree/main/bilibili-cleaner)
- 该扩展所固定的上游 [kokoryh/Sparkle Surge 模块](https://github.com/kokoryh/Sparkle/blob/12e89d6d93d72d39eb283ef81d2b58eb204cdb58/release/surge/module/bilibili.sgmodule)

上游扩展标注为 GPL-3.0-only，本模块同样以 GPL-3.0-only 提供。完整许可文本见 [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)。
