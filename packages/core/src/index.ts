import playerTemplate from '@/assets/template/player.ejs'
import pkg from '../package.json'
import './style/index.scss'
import Icons from '@/assets/icons/index'
import Controller from './components/controller'
import Events from './components/events'
import { EventsList } from './components/events'
import Hls from 'hls.js'

// 播放器入参配置
export interface PlayerOptions {
  container: HTMLElement // 播放器容器
  controlTarget?: HTMLElement // 控制器挂载目标
  src: string // 视频地址
  controls?: boolean // 是否显示控制条
  autoplay?: boolean // 是否自动播放
  loop?: boolean // 是否循环播放
  width?: string // 播放器宽度 "123px"
  height?: string // 播放器高度 "123px"
  poster?: string // 视频封面
  preload?: 'auto' | 'metadata' | 'none' // 预加载
  muted?: boolean // 是否静音
  volume?: number // 音量
  playbackRate?: number // 播放速率
  type: 'auto' | 'normal' | 'hls' | 'flv' | 'dash' // 视频类型
  waterMarkShow?: boolean // 是否显示水印
}

// 播放器名称和版本号
const { name, version } = pkg

// 控制台 banner
console.log(`${'\n'} %c ${name} v${version} ${'\n'}`, `color: white; font-size: 18px; background: linear-gradient(45deg, #ff0000 0%, #0092ff 80%);`)

let index = 0
const instances: TinyPlayer[] = []

export default class TinyPlayer {
  static title: string = name // 播放器名称
  static version: string = version // 版本号
  options: PlayerOptions // 播放器配置
  container: HTMLElement // 挂载目标元素
  videoContainer!: HTMLElement // 视频容器
  video!: HTMLVideoElement // 播放器
  paused: boolean = true // 是否暂停
  videoType: PlayerOptions['type'] = 'auto' // 视频类型
  hls?: Hls // hls 实例
  controller!: Controller // 控制器
  events!: Events // 事件
  waterMark?: HTMLElement // 水印节点

  constructor(options: PlayerOptions) {
    this.container = options.container
    this.options = options
    this.setup()
  }

  private setup() {
    // 初始化视频播放器
    // this.videoContainer = document.createDocumentFragment().appendChild(document.createElement('div'))
    this.videoContainer = document.createElement('div') as HTMLElement
    this.videoContainer.className = 'tiny-player-container'
    // 播放器模板
    this.videoContainer.innerHTML = playerTemplate(this.options)
    // 将 player 添加到指定容器中
    this.container.appendChild(this.videoContainer)
    // 视频节点
    this.video = this.videoContainer.querySelector('video') as HTMLVideoElement
    // 水印节点
    this.waterMark = this.videoContainer.querySelector('.tiny-player-watermark') as HTMLElement
    // 播放器事件系统
    this.events = new Events(this)
    // 播放器控制器
    this.controller = new Controller(this)
    // 初始化视频
    this.initVideo()
    this.handleWaterMarkShow(this.options.waterMarkShow)

    // 保存实例
    instances.push(this)
  }

  // 初始化播放器,设置视频相关回调函数
  private initVideo() {
    this.initMSE(this.video, this.options.type)

    // 播放回调
    this.on('play', () => {
      this.paused && this.onPlay()
    })
    // 暂停播放
    this.on('pause', () => {
      !this.paused && this.onPause()
    })
    // 播放结束
    this.on('ended', () => {
      if (!this.options.loop) {
        this.seek(0)
        this.pause()
      } else {
        this.seek(0)
        this.play()
      }
    })
  }

  // 当视频开始播放时，
  private onPlay = () => {
    console.log('🚀🚀🚀 / onPlay')
    // 更新播放器状态
    this.paused = false
    const playButton = this.controller.controls.playButton
    playButton && (playButton.innerHTML = Icons.pause)
    this.controller.updateSeekBar()
  }

  // 当视频暂停播放时
  private onPause = () => {
    console.log('🚀🚀🚀 / onPause')
    // 更新播放器状态
    this.paused = true
    const playButton = this.controller.controls.playButton
    playButton && (playButton.innerHTML = Icons.play)
    // 取消动画
    cancelAnimationFrame(this.controller.playRaf)
  }

  // 注册事件
  on(name: EventsList, callback: () => void) {
    this.events.on(name, callback)
  }

  // 手动触发事件
  emit(name: EventsList, data?: any) {
    this.events.emit(name, data)
  }

  // 移除事件
  off(name: EventsList, callback: () => void) {
    this.events.off(name, callback)
  }

  // MSE 支持
  initMSE(video: any, type: PlayerOptions['type']) {
    this.videoType = type
    if (type === 'hls') {
      this.videoType = 'hls'
      // 如果浏览器支持播放 HLS 视频流。
      if (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL')) this.videoType = 'normal'
      // 错误传参时，纠正播放类型
      if (/.mp4(#|\?|$)/i.exec(video.src)) this.videoType = 'normal'
    }
    if (type === 'auto') {
      if (/m3u8(#|\?|$)/i.exec(video.src)) this.videoType = 'hls'
      if (/.flv(#|\?|$)/i.exec(video.src)) this.videoType = 'flv'
      if (/.mpd(#|\?|$)/i.exec(video.src)) this.videoType = 'dash'
      this.videoType = 'normal'
    }
    console.log('🚀🚀🚀 MSE:', type, this.videoType, video.src)
    switch (this.videoType) {
      case 'normal':
        console.log('以默认形式播放 video')
        break
      case 'flv':
        console.error('暂不支持 flv 格式视频')
        break
      case 'dash':
        console.error('暂不支持 dash 格式视频')
        break
      case 'hls':
        console.log('以 hls 播放 video')
        this.useHls(video)
        break
    }
  }

  // 使用 hls 播放视频
  useHls = (video: any) => {
    this.hls = new Hls()
    this.hls.loadSource(video.src)
    this.hls.attachMedia(video)

    // TODO 走外部依赖的形式
    // console.log('🚀🚀🚀 / window.Hls:', window.Hls)
    // if (!window.Hls) return console.error("Error: Can't find Hls.")
    // if (window.Hls.isSupported()) return console.error('Hls is not supported')
    // const hls = new window.Hls()
    // hls.loadSource(video.src)
    // hls.attachMedia(video)
  }

  // 销毁 hls 实例
  destroyHls = () => {
    this.hls && this.hls.destroy()
  }

  // 播放视频
  play = () => {
    this.video.play()
  }

  // 暂停视频
  pause = () => {
    this.video.pause()
  }

  // 切换播放状态
  togglePlay = () => {
    if (this.video!.paused) {
      this.video!.play()
    } else {
      this.video!.pause()
    }
  }

  // 跳转到视频指定位置，调整视频播放进度
  seek = (time: number) => {
    this.video!.currentTime = time
  }

  // 调整视频音量
  setVolume = () => {
    // 调整视频音量
    this.volume(Number(this.controller.controls.volumeBar!.value))
  }

  // 设置音量
  volume(val: number | string) {
    let percentage = parseFloat((val || 0) as string)
    if (!isNaN(percentage)) {
      percentage = Math.max(percentage, 0)
      percentage = Math.min(percentage, 1)

      this.video.volume = percentage
      if (this.video.muted) {
        this.video.muted = false
      }
      this.controller.switchVolumeIcon()
    }
    return this.video.volume
  }

  // 静音或取消静音
  mute = () => {
    // 静音或取消静音
    this.video!.muted = !this.video!.muted
    this.controller.controls.volumeBar!.value = this.video!.muted ? '0' : this.video!.volume + ''
    this.controller.controls.muteButton!.innerHTML = this.video!.muted ? Icons.volumeOff : Icons.volumeUp
  }

  // 进入或退出全屏模式
  toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      this.videoContainer.requestFullscreen()
    }
  }

  // 控制水印的显示与隐藏
  handleWaterMarkShow = (show: boolean | undefined) => {
    console.log('🚀🚀🚀 / show:', show)

    if (this.waterMark) this.waterMark.style.display = show ? 'block' : 'none'
  }

  // 挂载控制器到目标节点
  mountController = (target: HTMLElement) => {
    console.log('🚀🚀🚀 / this.controller:', this.controller)
    target.appendChild(this.controller.controlNode)
  }

  // 销毁播放器
  destroy = () => {
    this.destroyHls()
    instances.splice(instances.indexOf(this), 1)
    this.pause()
    this.video.src = ''
    this.container.innerHTML = ''
    this.controller.destroy()
    // this.timer.destroy()
    // this.events.trigger('destroy')
  }
}
