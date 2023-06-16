# Tiny Player

<p align="center">
  <a href="https://tiny-player.vercel.app/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://assets.fedtop.com/picbed/202306061400114.png">
      <img alt="TinyPlayer" src="https://assets.fedtop.com/picbed/202306061400114.png" width="600" />
    </picture>
  </a>
</p>

<!-- <p align="center">
  <a href="https://github.com/wangrongding/tiny-player"><img alt="stars" src="https://img.shields.io/github/stars/wangrongding/ding-trans?style=flat" /></a>
  <a href="https://www.npmjs.com/package/tiny-player"><img alt="npm" src="https://img.shields.io/npm/dt/tiny-player?style=flat&label=downloads&color=cb3837&labelColor=cb0000&logo=npm" /></a>
</p> -->

---

<p align="center">
  <a href="https://tiny-player.vercel.app">Document</a> |
  <a href="#Features">Features</a> |
  <a href="#Development">Development</a> 
</p>

## Features

极简的视频播放器，内置硬解功能，软解功能，可支持原生控件样式，自定义控件样式。旨在用最小的体积实现所需全部功能的播放器！

- 🧩 兼容性好（ 0 依赖，任何框架和浏览器都可以使用，支持移动端。）
- 🌸 多格式支持，支持流式播放（支持 mp4、webm、ogg 等多种常见格式，支持 m3u8，支持自动切换。）
- 🌟 控制栏可插拔（支持自定义控制栏，控制栏挂载到目标节点，支持自定义控制栏组件显示隐藏。）
- 🎬 支持指定片段播放（通过入参指定片段播放，类裁剪。）
- 🎨 轻量（仅 25kb 大小，gzip 压缩后仅 7kb 大小。）
- 🥳 软解【wip】（支持音视频软解，支持自定义解码器，解决各个浏览器的兼容性问题。（开发中））

## Usage

### 安装

```sh
npm i tiny-player
# or
yarn add tiny-player
# or
pnpm add tiny-player
```

### 使用

```js
import TinyPlayer from 'tiny-player'

// 示例：实际使用的时候，很多参数都是可选的，只需要传入必要的参数即可，详情请查看文档
const tp = new TinyPlayer({
  container: document.querySelector('#tiny-player'), // 挂载节点
  poster: poster, // 封面地址
  controls: true, // 是否显示控制栏
  loop: true, // 循环播放
  volume: 0.9, // 音量
  autoplay: false, // 自动播放
  controlOptions: {
    playTime: true, // 是否显示播放时间
    volumeControl: true, // 是否显示音量控制条
    fullScreenControl: true, // 是否显示全屏按钮
    mountTarget: null, // 挂载目标节点
    nativeControls: false, // 是否使用原生控制条
  },
  preload: 'metadata', // 预加载
  src: videoSource, // 视频地址
  type: 'hls', // 视频类型
  waterMarkShow: true, // 是否显示水印
  waterMarkUrl: '//assets.fedtop.com/picbed/202306091010648.png',
  clipStart: 6, // 视频片段的开始时间
  clipEnd: 12, // 视频片段的结束时间
  // width: '800px', // 自定义宽度
  // height: '800px', // 自定义高度
  // "...":'...' // 开发中。。。
})
```

更多请查看[文档](https://tiny-player.vercel.app)

## Development

调试或开发本项目：确保 node 版本 >= 16.15.1 ，且全局安装 pnpm

```sh
npm install -g pnpm
```

```sh
# 安装依赖
pnpm i
# 开发调试
pnpm dev
# 构建
pnpm build
```

### 在其他项目中调试

通用型：

```sh
# 开发
pnpm dev
# 获取项目地址
cd packages/core && pwd # "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
# 在其他项目中安装
pnpm add "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
yarn add "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
npm i "/Users/xxx/xxx/chuangkit-tiny-player/packages/core"
```

软连接形式：

```sh
pnpm dev
# 如果其他项目以 npm 作为包管理器
cd packages/core && npm link
# 如果其他项目以 yarn 作为包管理器
cd packages/core && yarn link
# 如果其他项目以 pnpm 作为包管理器
cd packages/core && pnpm link

# 在其他项目中安装
# npm
npm link tiny-player
# yarn
yarn link tiny-player
# pnpm
pnpm link tiny-player
```

## 相关参考：

- [plyr](https://github.com/sampotts/plyr)
- [dplayer](https://dplayer.diygod.dev/zh/)
- [xgplayer](https://github.com/bytedance/xgplayer)
- [shaka-player](https://github.com/shaka-project/shaka-player)
- [videojs-player](https://github.com/surmon-china/videojs-player)
