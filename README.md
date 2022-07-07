## 概述

本文介绍如何快速跑通示例源码，体验基础的 ZIMKit 集成方案。

## 准备环境

在运行示例源码前，请确保开发环境满足以下要求：

- 电脑安装了 58 或以上版本的 Chrome 浏览器。
- 安装 node.js ，推荐使用 14.18.1 或以上版本。
- 设备已连接到网络。

## 前提条件

请联系 ZEGO 技术支持，申请接入 ZIM SDK 服务所需的 AppID 和 ServerSecret 并配置相关服务权限。

## 示例源码运行指引（Vue）

### 示例源码目录结构

```bash
├── README.md                     # 项目运行说明
├── package.json
├── public
├── src
│   ├── assets                    # 媒体资源
│   ├── views                     # 业务组件目录
│   ├── router                    # 业务组件路由
│   ├── store                     # 业务状态管理
│   ├── util                      # 工具类方法
│   ├── ZIMKit                    # ZIMKit SDK
│   ├── App.vue                   # 业务组件
│   ├── main.ts                   # 项目入口文件
│   ├── config.ts                 # SDK 配置文件
├── tsconfig.json                 # ts 配置文件
```

### 运行示例源码

1. 下载上方示例源码，打开 “src” 文件夹下的 “config.ts” 文件，并使用本文 [前提条件] 已获取的 AppID 和 ServerSecret 正确填写，并保存。

   ```typescript
   const appConfig = {
     appID: 0, // 填写申请的 AppID
     serverSecret: '', // 填写申请的 ServerSecret
   };
   ```

2. 依次运行以下命令来启动项目。

   ```bash
    npm install # 安装依赖包
    npm run dev # 依赖包安装成功后，启动项目
   ```
