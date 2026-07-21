# Vless-all-In-One多协议代理一键部署脚本

一个简单易用的多协议代理部署脚本，支持 **15 种主流协议**，服务端/客户端一键安装，适用于 Alpine、Debian、Ubuntu、CentOS 等 Linux 发行版。

> 🙏 **声明**：本人只是一个搬运工，脚本灵感来源于网络上的各种优秀项目，特别感谢 [mack-a/v2ray-agent](https://github.com/mack-a/v2ray-agent) 八合一脚本的启发。

---
💬 [Telegram 交流群](https://t.me/vless_vaio)

## ✨ 支持协议

| # | 协议 | 特点 | 推荐场景 | 抗检测评级 | 风险提示 |
|---|------|------|----------|-----------|----------|
| 1 | **VLESS + Reality** | 抗封锁能力强，无需域名 | 🌟 首选推荐 | ⭐⭐⭐⭐⭐ | ✅ 借用真实网站TLS身份，流量与目标网站一致，无需维护 |
| 2 | **VLESS + Reality + XHTTP** | 多路复用，性能更优 | 高并发场景 | ⭐⭐⭐⭐⭐ | ✅ HTTP/2多路复用，避免TLS-in-TLS特征 |
| 3 | **VLESS + WS + TLS** | CDN 友好，可作回落 | 被墙 IP 救活 | ⭐⭐⭐⭐ | ⚠️ 需真实证书，避免TLS指纹；建议配合CDN |
| 4 | **VMess + WS** | 回落分流/免流 | 端口复用 | ⭐⭐ | ⚠️ 已知漏洞：填充字段可被识别（[CVE](https://github.com/v2fly/v2ray-core/issues/2054)），必须配合CDN |
| 5 | **VLESS-XTLS-Vision** | TLS主协议，支持回落 | 稳定传输 | ⭐⭐⭐⭐ | ✅ Vision专门解决TLS-in-TLS检测问题 |
| 6 | **SOCKS5** | 经典代理协议 | 通用性强 | ⭐ | ❌ 明文传输，仅适合内网或本地环境 |
| 7 | **Shadowsocks 2022** | 新版加密，性能好 | SS 用户迁移 | ⭐⭐ | ⚠️ GFW主动探测+被动检测（[研究](https://gfw.report/blog/gfw_shadowsocks/)），UDP易暴露，建议TCP+多路复用 |
| 8 | **Hysteria2** | UDP 加速，端口跳跃 | 游戏/视频 | ⭐⭐ | ⚠️ GFW已可解密QUIC初始包，端口跳跃仅能缓解 |
| 9 | **Trojan** | TLS主协议，支持回落 | 伪装 HTTPS | ⭐⭐⭐ | ⚠️ 有TLS指纹风险，需真实证书+回落配置 |
| 10 | **Trojan + WS** | WebSocket 传输，可做回落 | 端口复用 | ⭐⭐⭐ | ⚠️ 配合CDN可提升隐蔽性 |
| 11 | **Snell v4** | Surge 专用协议 (支持 ShadowTLS) | iOS/Mac 用户 | ⭐⭐⭐ | ⚠️ 闭源协议，建议启用ShadowTLS增强 |
| 12 | **Snell v5** | Surge 5.0 新版协议 (支持 ShadowTLS) | 最新 Surge | ⭐⭐⭐ | ⚠️ 闭源协议，建议启用ShadowTLS增强 |
| 13 | **AnyTLS** | 多协议 TLS 代理 | 抗审查能力强 | ⭐⭐⭐⭐ | ✅ 多协议混合，增加识别难度 |
| 14 | **TUIC v5** | QUIC 协议，端口跳跃 | 低延迟 | ⭐⭐ | ⚠️ QUIC易被检测，端口跳跃可缓解 |
| 15 | **NaïveProxy** | HTTP/2 代理，抗检测 | 伪装能力强 | ⭐⭐⭐ | ⚠️ 需与Chrome版本同步，伊朗已被检测（[Issue](https://github.com/klzgrad/naiveproxy/issues/404)），维护成本高 |

> 💡 **ShadowTLS 插件**：Snell v4、Snell v5、SS2022 安装时可选择启用 ShadowTLS (v3) 插件，实现 TLS 流量伪装。

### 📊 协议特性对比

| 协议 | 过 CDN | 多路复用 | 可做回落 | 需要域名 | 传输层 |
|------|:------:|:--------:|:--------:|:--------:|:------:|
| VLESS + Reality | ❌ | ❌ | ❌ | 可选 | TCP |
| VLESS + XHTTP | ❌ | ✅ | ❌ | 可选 | HTTP/2 |
| VLESS + XHTTP + CDN | ✅ | ✅ | ❌ | ✅ | HTTP/2 |
| VLESS + WS | ✅ | ❌ | ✅ | ✅ | WebSocket |
| VMess + WS | ✅ | ❌ | ✅ | ✅ | WebSocket |
| VLESS-Vision | ❌ | ❌ | ✅(主) | ✅ | XTLS |
| Trojan | ❌ | ❌ | ✅(主) | ✅ | TLS |
| Trojan + WS | ✅ | ❌ | ✅ | ✅ | WebSocket |
| Hysteria2 | ❌ | ✅ | ❌ | ✅ | QUIC |
| TUIC v5 | ❌ | ✅ | ❌ | ✅ | QUIC |
| NaïveProxy | ✅ | ✅ | ❌ | ✅ | HTTP/2 |
| AnyTLS | ❌ | ❌ | ❌ | ❌ | TLS |
| ShadowTLS 套壳 | ❌ | ❌ | ❌ | ❌ | TLS 伪装 |



---

## 🚀 快速开始

### 一键安装服务端
https://gitlab.com/chil30-group/vless-all-in-one/-/raw/main/vless-server.sh
```bash
wget -O vless-server.sh https://gitlab.com/chil30-group/vless-all-in-one/-/raw/main/vless-server.sh && chmod +x vless-server.sh && ./vless-server.sh
```

### 服务端安装

```bash
vless
# 选择 1) 安装新协议
# 选择协议 (推荐 1-VLESS+Reality)
# 确认安装
```

安装完成后显示：
- **JOIN 码** - 复制给客户端使用
- **分享链接** - 可导入 v2rayN、Clash、小火箭等
- **二维码** - 手机扫码导入
- **订阅链接** - Clash/Surge/V2Ray/Loon 订阅

### 客户端脚本

Linux 客户端脚本已移至 [Releases](https://github.com/Chil30/vless-all-in-one/releases) 页面下载。

---

## 🌐 分流功能

分流功能让你可以为不同网站配置不同的代理出口：Netflix 走直连、ChatGPT 走新加坡节点、TikTok 走日本节点等。

### 四种出口类型

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **直连** | 使用本机 IP 出口 | 服务器本机已解锁的流媒体 |
| **WARP** | Cloudflare 免费出口 | 免费解锁 |
| **链式代理** | 导入已解锁的节点 | 用自己的解锁机落地 |
| **双层链式** | WARP → 落地节点 | 隐藏真实 IP + 解锁 |

### 预设规则

支持 OpenAI、Netflix、Disney+、YouTube、Spotify、TikTok、Telegram、Google、广告屏蔽等 geosite 规则。

> 📖 详细使用方法请参阅 [USE_GUIDE.md](USE_GUIDE.md#分流功能)

###  多IP入出站配置

多IP VPS 用户可以配置入站IP到出站IP的映射规则：

- 🖥️ 自动检测服务器所有公网IP（IPv4/IPv6）
- 🔀 配置入站IP → 出站IP映射
- ⚡ 多线路服务器精确控制出站IP

```bash
vless → 8) 分流管理 → 2) 链式代理 → 5) 多IP入出站配置
```

> 📖 详细使用方法请参阅 [USE_GUIDE.md](USE_GUIDE.md#多ip入出站配置)

---

## 👥 用户管理

脚本支持多用户管理，每个协议可添加多个用户。

### 功能特性

| 功能 | 说明 |
|------|------|
| 添加/删除用户 | 为每个协议添加独立用户 |
| 流量配额 | 设置每个用户的流量限制 |
| **到期日期** | 设置用户有效期，过期自动禁用 |
| 实时统计 | 查看用户实时流量数据 |
| 启用/禁用 | 临时禁用用户而不删除 |
| 分享链接 | 查看每个用户的专属链接/二维码 |
| TG 通知 | 流量超限/即将过期自动 Telegram 通知 |
| 用户级路由 | 同端口不同用户配置不同落地节点 |

> 💡 **用户级路由**：每个用户可独立配置出站路由（直连/WARP/链式代理/负载均衡），优先于全局分流规则。

> 💡 **到期管理**：支持手动检查 `--check-expire` 或安装 cron 自动检查 `--setup-expire-cron`。

```bash
vless → 4) 用户管理
```

> 📖 详细使用方法请参阅 [USE_GUIDE.md](USE_GUIDE.md#用户管理)

---

## 🔧 配置管理

一键备份和恢复所有配置，方便服务器迁移或 IP 更换。

```bash
vless → 5) 查看协议配置 → 配置管理
```

- **导出配置**：备份协议配置、分流规则、节点列表
- **导入配置**：全部导入或选择性导入
- **自动更新 IP**：服务器 IP 变化后自动更新所有配置

> 📖 详细使用方法请参阅 [USE_GUIDE.md](USE_GUIDE.md#配置管理)

---

## 📡 订阅服务

自动生成 Clash/Surge/V2Ray 订阅链接，支持外部节点聚合。

### 订阅特性

- ✅ 自动包含所有已安装协议
- ✅ 安装/卸载协议后自动更新
- ✅ HTTPS 加密 + 伪装网页
- ✅ 外部节点管理，多机聚合

```bash
vless → 6) 订阅服务管理
```

> 📖 详细使用方法请参阅 [USE_GUIDE.md](USE_GUIDE.md#订阅服务)

---

## 🔌 端口复用说明

### 工作原理

```
客户端 → 8443 端口 → VLESS-Vision/Trojan (TLS主协议)
                              ↓ 回落
                         VLESS-WS (子协议，监听 127.0.0.1)
                         VMess-WS (子协议，监听 127.0.0.1)
                         Trojan-WS (子协议，监听 127.0.0.1)
```

### 使用方法

1. **先安装 TLS 主协议** (VLESS-Vision 或 Trojan)
2. **再安装回落子协议** (VLESS-WS 或 VMess-WS)
3. 子协议自动识别为回落模式，推荐随机内部端口
4. 订阅链接自动使用 8443 端口

### 优势

- 🔒 只需开放 8443 端口，防火墙配置简单
- 🎭 流量特征像正常 HTTPS 网站
- 📱 多协议共用一个端口，客户端配置简单

---

## ⚡ 端口跳跃 (Hysteria2 / TUIC)

### 什么是端口跳跃

端口跳跃 (Port Hopping) 是 Hysteria2 和 TUIC 的抗封锁特性：
- 服务端用 iptables 将一段端口范围（如 20000-50000）转发到实际监听端口
- 客户端在这个范围内随机切换端口连接
- 流量分散在多个端口，更难被识别和封锁

### 工作原理

```
客户端 → 随机端口 (20000-50000) → iptables NAT → Hysteria2/TUIC (实际端口)
         ↓ 定时切换
客户端 → 另一个随机端口 → iptables NAT → Hysteria2/TUIC (实际端口)
```

### 安装时配置

```
端口跳跃(Port Hopping)
说明：会将一段 UDP 端口范围重定向到 15999
是否启用端口跳跃? [y/N]: y
起始端口 [回车默认 20000]: 
结束端口 [回车默认 50000]: 
```

### 客户端配置

启用端口跳跃后，需要手动修改客户端端口为范围格式：
- 原端口：`15999`
- 改为：`20000-50000`

### 客户端支持情况

| 客户端 | 支持端口范围 |
|--------|-------------|
| Shadowrocket | ✅ |
| Stash | ✅ |
| Surge | ✅ |
| Clash Meta | ✅ |
| NekoBox | ✅ |
| V2RayN/NG | ✅ |

---

## 🔐 DNS-01 证书验证

支持 NAT 机器无 80 端口申请证书：

- Cloudflare DNS 验证
- 阿里云 DNS 验证
- DNSPod (腾讯云) DNS 验证
- 手动 DNS 验证 (适合任何 DNS 服务商)

---

## 🚀 BBR 网络优化

智能 TCP/IP 优化，根据服务器配置自动选择最佳参数：

```bash
vless
# 主菜单 → 7) BBR 网络优化
```

### 智能参数配置

脚本会自动检测系统配置，根据内存大小选择最佳优化档位：

| 档位 | 内存范围 | 读写缓冲区 | 最大连接队列 | 文件句柄 |
|------|----------|-----------|-------------|---------|
| 经典级 | ≤512MB | 8MB | 32768 |
| 轻量级 | 512MB-1GB | 16MB | 49152 |
| 标准级 | 1GB-2GB | 32MB | 65535 |
| 高性能级 | 2GB-4GB | 64MB | 65535 |
| 企业级 | 4GB-8GB | 128MB | 65535 |
| 旗舰级 | >8GB | 128MB | 65535 |

效果：提升 TCP 传输速度、降低延迟、改善高丢包环境。

> 📖 详细使用方法请参阅 [USE_GUIDE.md](USE_GUIDE.md#bbr-优化)

---

## 🌐 CF Tunnel(Argo) 内网穿透

无需公网 IP，通过 Cloudflare 边缘节点访问代理服务，适合 NAT 机器或动态 IP 环境。

```bash
vless → 9) CF Tunnel(Argo)
```

### 隧道类型

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| **快速隧道** | trycloudflare.com 临时域名 | 测试、临时使用 |
| **命名隧道** | 自定义域名 | 生产环境 |

### 支持的协议

| 协议 | 说明 | 推荐 |
|------|------|:----:|
| **VLESS-WS (无TLS)** | 由 CF Tunnel 提供 TLS | ⭐ |
| **VLESS-WS** | 需要域名证书 | |
| **VMess-WS** | 需要域名证书 | |

> 💡 **推荐使用 VLESS-WS（无TLS）**：安装时选择「VLESS-WS-CF (无TLS)」，无需申请证书，CF Tunnel 自动提供 TLS 加密。

> 📖 详细使用方法请参阅 [USE_GUIDE.md](USE_GUIDE.md#cf-tunnelargo)

---

## 🖥️ 界面预览

### 主菜单
```
═════════════════════════════════════════════
      多协议代理 一键部署  [服务端]
      作者: Chil30  快捷命令: vless
      https://github.com/Chil30/vless-all-in-one
═════════════════════════════════════════════
  服务端管理
  系统: ubuntu | 架构: Xray+Sing-box 双核
  状态: ● 运行中
  协议: VLESS+Reality, VLESS-WS, Hysteria2
  端口: 443, 10999
  分流: 3条规则→Japan+04+Amazon
─────────────────────────────────────────────
  1) 安装新协议 (多协议共存)
  2) 核心版本管理 (Xray/Sing-box)
  3) 卸载指定协议
  4) 用户管理 (多用户/流量/通知)
  ───────────────────────────────────────────
  5) 查看协议配置
  6) 订阅服务管理
  7) 管理协议服务
  8) 分流管理
  9) CF Tunnel(Argo)
  ───────────────────────────────────────────
 10) BBR 网络优化
 11) 查看运行日志
  u) 检查更新
  0) 退出
─────────────────────────────────────────────
```

> 📖 更多界面预览请参阅 [USE_GUIDE.md](USE_GUIDE.md)

---

## 📱 客户端推荐

| 平台 | 推荐客户端 | 订阅支持 |
|------|-----------|----------|
| **Windows** | [Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev) | ✅ Clash 订阅 |
| **Windows** | [V2rayN](https://github.com/2dust/v2rayN) | ✅ V2Ray 订阅 |
| **macOS** | [Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev) | ✅ Clash 订阅 |
| **macOS** | [Surge](https://nssurge.com/) | ✅ Surge 订阅 |
| **iOS** | [Shadowrocket](https://apps.apple.com/app/shadowrocket/id932747118) | ✅ 通用订阅 |
| **iOS** | [Surge](https://apps.apple.com/app/surge-5/id1442620678) | ✅ Surge 订阅 |
| **iOS** | [Loon](https://apps.apple.com/app/loon/id1373567447) | ✅ V2Ray 订阅 |
| **Android** | [Clash Meta](https://github.com/MetaCubeX/ClashMetaForAndroid) | ✅ Clash 订阅 |
| **Android** | [V2rayNG](https://github.com/2dust/v2rayNG) | ✅ V2Ray 订阅 |

### XHTTP 协议客户端支持

> ⚠️ **注意**: XHTTP 是较新的协议，客户端支持有限

| 平台 | 客户端 | XHTTP 支持 |
|------|--------|:---------:|
| Android | V2rayNG 1.8.31+ | ✅ |
| Android | NekoBox | ✅ |
| iOS | Streisand | ✅ |
| iOS | Shadowrocket | ❌ |
| iOS | Quantumult X | ❌ |
| Windows | V2rayN (Xray核心) | ✅ |

> 💡 iOS 用户如需 CDN 支持，建议改用 **VLESS+WS+TLS** 协议，兼容性更好。

---

## 🔧 代理模式说明 (客户端)

### 1️⃣ TUN 网卡模式 (推荐)
```
创建虚拟网卡 tun0，修改系统路由表
✅ 全局透明代理，所有应用自动走代理
✅ 支持 TCP/UDP
❌ LXC 容器可能不支持
```

### 2️⃣ 全局代理模式 (iptables)
```
使用 iptables 劫持流量
✅ 兼容性好
✅ 支持纯 IPv6 + WARP 环境
❌ 仅代理 TCP 流量
```

### 3️⃣ SOCKS5 模式
```
仅启动 SOCKS5 代理 (127.0.0.1:10808)
✅ 无需特殊权限，兼容性最好
❌ 需要手动配置应用使用代理
```

---

## 📋 系统要求

### 支持的系统
- Debian 9+ / Ubuntu 18.04+
- CentOS 7+
- Alpine Linux 3.12+

### 架构支持
- x86_64 (amd64)
- ARM64 (aarch64)

### WARP 官方客户端限制
- ❌ Alpine Linux 不支持（依赖 glibc）
- ✅ Debian/Ubuntu/CentOS 支持

---

## ❓ 常见问题

> 📖 **完整故障排查指南**：请参阅 [FAQ.md](FAQ.md)，包含 20 个排查章节、诊断命令和快速诊断脚本。

### Q: 订阅链接返回 404
- 检查 Nginx 是否运行：`ss -tlnp | grep 18443`
- 检查订阅文件是否存在：`ls /etc/vless-reality/subscription/`
- 重新配置订阅：主菜单 → 订阅管理 → 重新配置

### Q: Clash 订阅导入后部分协议超时
- 检查是否为回落子协议，确认使用 18443 端口
- 更新订阅文件：主菜单 → 订阅管理 → 刷新订阅内容

### Q: 安装失败，提示依赖安装失败
```bash
# Debian/Ubuntu
apt update && apt install -y curl jq unzip iproute2 nginx

# CentOS
yum install -y curl jq unzip iproute nginx

# Alpine
apk add curl jq unzip iproute2 nginx
```

### Q: TUN 模式启动失败
- LXC 容器不支持 TUN，请使用全局代理或 SOCKS5 模式
- 检查 TUN 模块：`ls -la /dev/net/tun`

### Q: Hysteria2/TUIC 端口跳跃不生效
- 检查 iptables 规则：`iptables -t nat -L PREROUTING -n | grep REDIRECT`
- NAT 机器不支持端口跳跃（服务商只给固定端口）

### Q: WARP 官方客户端注册失败
- 确保系统不是 Alpine（不支持官方客户端）
- 检查 warp-svc 服务：`systemctl status warp-svc`

### Q: WARP 分流不生效
- 检查 WARP 状态：分流管理 → WARP 管理 → 测试连接
- 确认分流规则已配置：分流管理 → 查看当前配置

---

## 📁 文件位置

```
/etc/vless-reality/
├── config.json           # Xray 主配置文件
├── singbox.json          # Sing-box 配置文件
├── db.json               # JSON 数据库 (协议配置、分流规则、链式代理节点)
├── warp.json             # WGCF 配置文件
├── sub.info              # 订阅服务配置
├── external_links.txt    # 外部节点分享链接
├── external_subs.txt     # 外部节点订阅链接
├── subscription/         # 订阅文件目录
│   └── {uuid}/
│       ├── clash.yaml
│       ├── surge.conf
│       └── base64
├── external_nodes_cache/ # 外部节点缓存
├── certs/                # 证书目录
├── backup/               # 配置备份目录
└── logs/                 # 日志目录
```


## ⚠️ 免责声明

- 本脚本仅供学习交流使用
- 作者不对使用本脚本造成的任何后果负责

---

