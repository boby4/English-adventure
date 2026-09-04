// 单例音频管理器与自然拼读发音服务
// 解决频繁 new AudioContext 导致的内存泄漏与浏览器静音限制

class AudioManager {
  private ctx: AudioContext | null = null
  private isSoundEnabled = true

  // 懒加载初始化 AudioContext
  private getContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        this.ctx = new AudioContextClass()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled
  }

  public getSoundEnabled(): boolean {
    return this.isSoundEnabled
  }

  // 1. 轻快气泡/抓取声 (Pop)
  public playPop() {
    if (!this.isSoundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const t = ctx.currentTime

      osc.frequency.setValueAtTime(400, t)
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.08)

      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.08)
    } catch (e) {}
  }

  // 2. 磁吸成功声 (Snap) - 清脆明亮的两声连续叮咚
  public playSnap() {
    if (!this.isSoundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const t = ctx.currentTime
      // Note 1
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(523.25, t) // C5
      gain1.gain.setValueAtTime(0.18, t)
      gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.12)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(t)
      osc1.stop(t + 0.12)

      // Note 2
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(659.25, t + 0.08) // E5
      gain2.gain.setValueAtTime(0.22, t + 0.08)
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.22)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(t + 0.08)
      osc2.stop(t + 0.22)
    } catch (e) {}
  }

  // 3. 果冻弹回声 (Boing) - 错误或松手弹回
  public playBoing() {
    if (!this.isSoundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const t = ctx.currentTime

      // 频率滑降并快速回弹
      osc.frequency.setValueAtTime(320, t)
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.15)
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.25)

      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.25)
    } catch (e) {}
  }

  // 4. 自动飞入呼啸声 (Whoosh)
  public playWhoosh() {
    if (!this.isSoundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const t = ctx.currentTime

      osc.frequency.setValueAtTime(300, t)
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.18)

      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.2)
    } catch (e) {}
  }

  // 5. 关卡胜利/大和弦琶音 (Fanfare)
  public playSuccess() {
    if (!this.isSoundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const t = ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        const startTime = t + idx * 0.09
        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.22, startTime)
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.35)
      })
    } catch (e) {}
  }

  // 6. 星星弹射音 (Star Pop)
  public playStar(index: number = 0) {
    if (!this.isSoundEnabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      const t = ctx.currentTime
      const baseFreq = 587.33 * (1 + index * 0.2) // D5 升调

      osc.frequency.setValueAtTime(baseFreq, t)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.15)

      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.18)
    } catch (e) {}
  }

  // 7. 自然拼读发音与标准发音
  private phonicsHints: Record<string, string> = {
    A: 'a',
    B: 'buh',
    C: 'kuh',
    D: 'duh',
    E: 'eh',
    F: 'fff',
    G: 'guh',
    H: 'huh',
    I: 'ih',
    J: 'juh',
    K: 'kuh',
    L: 'lll',
    M: 'mmm',
    N: 'nnn',
    O: 'ah',
    P: 'puh',
    Q: 'kwuh',
    R: 'rrr',
    S: 'sss',
    T: 'tuh',
    U: 'uh',
    V: 'vvv',
    W: 'wuh',
    X: 'ks',
    Y: 'yuh',
    Z: 'zzz'
  }

  // 播放自然拼读音
  public playPhonics(letter: string, voiceName?: string) {
    if (!this.isSoundEnabled || !('speechSynthesis' in window)) return
    const char = letter.toUpperCase()
    const phoneticText = this.phonicsHints[char] || char

    this.speak(phoneticText, {
      rate: 0.85,
      pitch: 1.35,
      cancel: true,
      voiceName
    })
  }

  // 播放标准单词
  public playWord(word: string, voiceName?: string) {
    if (!this.isSoundEnabled || !('speechSynthesis' in window)) return
    const cleanWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    this.speak(cleanWord, {
      rate: 0.75,
      pitch: 1.05,
      cancel: true,
      voiceName
    })
  }

  // 播放句子
  public playSentence(sentence: string, voiceName?: string) {
    if (!this.isSoundEnabled || !('speechSynthesis' in window)) return
    this.speak(sentence, {
      rate: 0.75,
      pitch: 1.05,
      cancel: true,
      voiceName
    })
  }

  // 底层通用 speak 封装
  public speak(
    text: string,
    options: {
      rate?: number
      pitch?: number
      volume?: number
      cancel?: boolean
      voiceName?: string
    } = {}
  ) {
    if (!this.isSoundEnabled || !('speechSynthesis' in window)) return

    try {
      if (options.cancel !== false) {
        window.speechSynthesis.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = options.rate ?? 0.8
      utterance.pitch = options.pitch ?? 1.1
      utterance.volume = options.volume ?? 1.0

      const voices = window.speechSynthesis.getVoices()
      let matchedVoice = null
      if (options.voiceName) {
        matchedVoice = voices.find(v => v.name === options.voiceName)
      }
      if (!matchedVoice) {
        matchedVoice =
          voices.find(v => v.name.includes('Google US English')) ||
          voices.find(v => v.name.includes('Microsoft David')) ||
          voices.find(v => v.name.includes('Microsoft Zira')) ||
          voices.find(v => v.lang === 'en-US') ||
          voices.find(v => v.lang.startsWith('en'))
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice
      }

      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.warn('Speech synthesis error:', e)
    }
  }

  public stopAllSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}

export const audioManager = new AudioManager()

