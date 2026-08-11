import { Injectable, NgZone } from '@angular/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { DeckBuilder, DrawHooks, generate } from 'gkcoi'
import { DeckBuilderOptions, ShipImageKind } from 'gkcoi/dist/type'
import { BehaviorSubject } from 'rxjs'
import { KanColleConstant } from '../constants/kancolle.constant'
import { gkcoiLang } from '../enums/gkcoi-lang.enum'
import { gkcoiTheme } from '../enums/gkcoi-theme.enum'
import { KanColleBuilderConfig } from '../interfaces/kancolle-builder-config.interface'
import { KanColleConfigService } from './kancolle-config.service'

@Injectable()
export class KanColleBuilderService {
  private readonly config: KanColleBuilderConfig = {
    lang: gkcoiLang.EN,
    theme: gkcoiTheme.DARK,
    f1: true,
    f2: false,
    f3: false,
    f4: false,
    lbas: false,
    hideShipImage: false,
    extendEquipText: false,
    extendLbas: true,
  }

  private readonly configSubject = new BehaviorSubject<KanColleBuilderConfig>(this.config)

  private readonly LS_KEY = 'config'

  constructor(
    private readonly zone: NgZone,
    private readonly snackBar: MatSnackBar,
    private readonly kcConfigService: KanColleConfigService,
  ) {
    this.loadConfig()
  }

  public getConfig() {
    const config = { ...this.config }
    return config
  }

  public getConfigObservable() {
    return this.configSubject.asObservable()
  }

  public setConfig(value: KanColleBuilderConfig) {
    Object.assign(this.config, value)
    this.saveConfig()
    this.emitConfig()
  }

  public setLang(value: gkcoiLang) {
    const isValid = Object.values(gkcoiLang).includes(value)
    if (!isValid) {
      return
    }

    this.config.lang = value
    this.emitConfig()
  }

  public setTheme(value: gkcoiTheme) {
    const isValid = Object.values(gkcoiTheme).includes(value)
    if (!isValid) {
      return
    }

    this.config.theme = value
    this.emitConfig()
  }

  public setLbas(value: boolean) {
    this.config.lbas = value
    this.emitConfig()
  }

  public updateConfigByDeck(deck: DeckBuilder & Record<string, any>) {
    if (!deck) {
      return
    }

    // Auto select lang
    if (deck.lang) {
      this.setLang(deck.lang.toLowerCase() as gkcoiLang)
    }

    // Auto select theme
    if (deck.theme) {
      this.setTheme(deck.theme.toLowerCase() as gkcoiTheme)
    }

    // Auto select LBAS
    if ([1, 2, 3].some(v => deck['a' + v])) {
      this.setLbas(true)
    }

    // Use custom data to auto select fleets
    const { sortied, combined } = deck
    if ([1, 2, 3, 4].includes(sortied)) {
      if (combined) {
        this.setConfig({ f1: true, f2: true })
      } else {
        this.setConfig({ f1: false })
        this.setConfig({ ['f' + sortied]: true })
      }
    } else if (deck.f3?.s7) {
      this.setConfig({ f1: false, f3: true })
    } else if (combined) {
      this.setConfig({ f1: true, f2: true })
    }
  }

  public async generateCanvas(baseDeckBuilder: DeckBuilder) {
    const deckBuilder = this.generateDeckBuilder(baseDeckBuilder)
    const options = this.getGenerateOptions()

    try {
      const canvas = await generate(deckBuilder, options)
      return canvas
    } catch (error) {
      this.openSnackBar(error.message)
      throw error
    }
  }

  public openSnackBar(message: string, action?: string, config?: MatSnackBarConfig) {
    this.zone.run(() => {
      this.snackBar.open(message, action, config)
    })
  }

  private emitConfig() {
    this.configSubject.next(this.config)
  }

  private generateDeckBuilder(baseDeckBuilder: any) {
    const deckBuilder = { ...baseDeckBuilder }
    Object.entries(this.config).forEach(([key, value]) => {
      if (['lang', 'theme'].includes(key)) {
        deckBuilder[key] = value
        return
      }
      if (key === 'lbas' && !value) {
        [1, 2, 3].forEach(v => delete deckBuilder['a' + v])
        return
      }
      if (typeof value === 'boolean' && !value) {
        delete deckBuilder[key]
      }
    })
    this.clearErrorIds(deckBuilder)
    Object.assign(deckBuilder, { options: this.generateDeckBuilderOptions() })
    return deckBuilder as DeckBuilder
  }

  private generateDeckBuilderOptions() {
    const theme = this.config.theme
    const options: DeckBuilderOptions = {
      hideShipImage: !!this.config.hideShipImage,
    }

    options.drawHooks = {
      drawShipImage: async ({ ctx, ship }) => {
        try {
          const image = await ship.fetchImage('remodel' as ShipImageKind)
          ctx.drawImage(
            image,
            0, 3, image.width, image.height,
            -100, 0, image.width, image.height,
          )
        } catch (error) {
          console.warn(error)
        }
      },
      drawLbEquipText: ({ ctx, indexes, text }) => {
        if (text.length >= 80) {
          ctx.font = '9px Meiryo'
        } else if (text.length >= 75) {
          ctx.font = '10px Meiryo'
        } else if (text.length >= 65) {
          ctx.font = '11px Meiryo'
        } else if (text.length >= 55) {
          ctx.font = '12px Meiryo'
        } else {
          ctx.font = '14px Meiryo'
        }
        ctx.fillText(text, 35, 90 + indexes[0] * 182 + 23 * indexes[1])
        ctx.font = '14px Meiryo'
      },
    }

    if (!options.hideShipImage && this.config.extendEquipText) {
      const hooks: DrawHooks = {
        drawShipImage: async ({ ctx, ship }) => {
          try {
            const image = await ship.fetchImage('remodel' as ShipImageKind)
            ctx.drawImage(
              image,
              0, 3, image.width, image.height,
              -150, 0, image.width, image.height,
            )
          } catch (error) {
            console.warn(error)
          }
        },
        drawShipEquipOverlay: ({ ctx }) => {
          let gradient!: CanvasGradient
          if (theme === 'dark' || theme === 'dark-ex') {
            gradient = ctx.createLinearGradient(0, 65, 998, 65)
            gradient.addColorStop(0, '#1a1a1a00')
            gradient.addColorStop(0.2, '#1a1a1a')
            gradient.addColorStop(0.8, '#1a1a1a')
            gradient.addColorStop(1, '#ffffff')
          }
          if (theme === 'light' || theme === 'light-ex') {
            gradient = ctx.createLinearGradient(0, 65, 998, 65)
            gradient.addColorStop(0, '#fafafa00')
            gradient.addColorStop(0.2, '#fafafa')
            gradient.addColorStop(0.8, '#fafafa')
            gradient.addColorStop(1, '#fafafa')
          }
          if (gradient) {
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, 650, 176)
          }
        },
        drawEquipImage: ({ ctx, index, image }) => {
          ctx.drawImage(image, 189, 33 + 23 * index)
        },
        drawEquipText: ({ ctx, index, text }) => {
          if (text.length >= 80) {
            ctx.font = '9px Meiryo'
          } else if (text.length >= 75) {
            ctx.font = '10px Meiryo'
          } else if (text.length >= 65) {
            ctx.font = '11px Meiryo'
          } else if (text.length >= 55) {
            ctx.font = '12px Meiryo'
          } else {
            ctx.font = '14px Meiryo'
          }
          ctx.fillText(text, 220, 52 + 23 * index)
          ctx.font = '14px Meiryo'
        },
        drawEquipEmpty: ({ ctx, index, text }) => {
          ctx.fillText(`(${text})`, 220, 52 + 23 * index)
          ctx.fillText('-', 202, 53 + 23 * index)
        },
        drawEquipSlotNum: ({ ctx, index, text }) => {
          ctx.fillText(text, 189, 52 + 23 * index)
        },

      }
      Object.assign(options.drawHooks, hooks)
    }

    if (this.config.extendLbas) {
      options.lbasExtraWidth = 230 - 7 // -7 so that final canvas width is 1800
    }

    return options
  }

  /**
   * Temporary disable ids due to gkcoi generate error
   */
  private clearErrorIds(deck: any) {
    const errorItemIds: string[] = [
      // 102, // Type 98 Reconnaissance Seaplane (Night Recon)
      // 469, // Type 0 Reconnaissance Seaplane Model 11B Kai (Night Recon)
    ]

    const disableItem = (item: any) => {
      if (!item) return
      if (!errorItemIds.includes(item.id)) return
      item.id = 0
    }

    ['f1', 'f2', 'f3', 'f4'].forEach(fid => {
      const fleet = deck[fid]
      if (!fleet) return
      ['s1', 's2', 's3', 's4', 's5', 's6', 's7'].forEach(sid => {
        const ship = fleet[sid]
        if (!ship?.items) return
        ['i1', 'i2', 'i3', 'i4', 'i5', 'i6'].forEach(iid => {
          const item = ship.items[iid]
          disableItem(item)
        })
      })
    });

    ['a1', 'a2', 'a3'].forEach(aid => {
      const lbas = deck[aid]
      if (!lbas?.items) return
      ['i1', 'i2', 'i3', 'i4'].forEach(iid => {
        const item = lbas.items[iid]
        disableItem(item)
      })
    });
  }

  private getGenerateOptions() {
    const config = this.kcConfigService.getConfig()
    const options = !!config.useCustomOptions
      ? KanColleConstant.GKCOI_GENERATE_OPTIONS
      : undefined
    return options
  }

  private saveConfig() {
    const cfg = { ...this.config }
    delete cfg.f1
    delete cfg.f2
    delete cfg.f3
    delete cfg.f4
    delete cfg.lbas
    localStorage.setItem(this.LS_KEY, JSON.stringify(cfg))
  }

  private loadConfig() {
    try {
      const cfg = JSON.parse(localStorage.getItem(this.LS_KEY) || '{}')
      this.setConfig(cfg)
    } catch (error) {
      // ignore
    }
  }
}
