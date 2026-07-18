# PrivateTracker

适用于 **Surge** 的 PT / 私有 Tracker 域名分流规则。该规则通过 `DOMAIN-SUFFIX` 匹配已收录站点的主域名及其所有子域名，并将请求交由你指定的策略组或策略处理。

> 规则仅用于网络分流与连接管理；请遵守所在地法律、Tracker 站点规则及其邀请与账号使用规范。



## 使用方法

将规则文件作为远程规则集（Rule Set）添加到 Surge 配置中，并为它指定一个合适的策略组。

```ini
RULE-SET,https://raw.githubusercontent.com/PANGPANGDigital/ProxyToolkit/main/Surge/Rule/PrivateTracker/PrivateTracker.list
```


## 维护说明

- 个人自用版

如遇站点更换域名、增加新域名或出现误匹配，请在项目仓库提交 Issue 或 Pull Request，并附上可核验的域名信息。

