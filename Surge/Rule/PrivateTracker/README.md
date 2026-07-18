# PrivateTracker

适用于 **Surge** 的 PT / 私有 Tracker 域名分流规则。该规则通过 `DOMAIN-SUFFIX` 匹配已收录站点的主域名及其所有子域名，并将请求交由你指定的策略组或策略处理。

> 规则仅用于网络分流与连接管理；请遵守所在地法律、Tracker 站点规则及其邀请与账号使用规范。

## 收录范围

当前规则共收录 **12** 个域名：

| 域名 |
| --- |
| `audiences.me` |
| `m-team.cc` |
| `hdhome.org` |
| `hdarea.club` |
| `pterclub.net` |
| `hddolby.com` |
| `ourbits.club` |
| `keepfrds.com` |
| `hhanclub.net` |
| `springsunday.net` |
| `totheglory.im` |
| `agsvpt.com` |

## 使用方法

将规则文件作为远程规则集（Rule Set）添加到 Surge 配置中，并为它指定一个合适的策略组。

```ini
[Rule]
RULE-SET,https://raw.githubusercontent.com/PANGPANGDigital/ProxyToolkit/main/Surge/Rule/PrivateTracker.list,PT-DIRECT
```

其中：

- 将 `PT-DIRECT` 替换为你自己的策略组名称，例如 `DIRECT`、`Proxy` 或 `PT`。
- 请把这条规则放在会产生冲突的通用规则之前，例如 `GEOIP`、`FINAL`、`MATCH`，以保证优先命中。
- 如果你的 Surge 版本或仓库分支不同，请以实际规则文件地址为准。

若你使用本地规则，也可以将 `PrivateTracker.list` 的内容直接合并到 `[Rule]` 段，并在每条规则末尾补上策略名称，例如：

```ini
[Rule]
DOMAIN-SUFFIX,m-team.cc,PT-DIRECT
DOMAIN-SUFFIX,ourbits.club,PT-DIRECT
```

## 匹配逻辑

规则采用 `DOMAIN-SUFFIX` 类型，因此会同时匹配根域名及其子域名。例如：

```text
DOMAIN-SUFFIX,m-team.cc
```

可匹配 `m-team.cc`、`www.m-team.cc` 等以该域名结尾的请求。

## 维护说明

- 规则作者：PANGPANGDigital
- 项目地址：<https://github.com/PANGPANGDigital/ProxyToolkit/tree/main/Surge/Rule>
- 规则文件头标注更新时间：2026-08-18 15:00:00

如遇站点更换域名、增加新域名或出现误匹配，请在项目仓库提交 Issue 或 Pull Request，并附上可核验的域名信息。

