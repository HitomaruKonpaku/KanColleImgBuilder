import { Injectable, NgZone } from '@angular/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { DeckBuilder, generate } from 'gkcoi'
import { BehaviorSubject } from 'rxjs'
import { KanColleConstant } from '../constants/kancolle.constant'
import { gkcoiLang } from '../enums/gkcoi-lang.enum'
import { gkcoiTheme } from '../enums/gkcoi-theme.enum'
import { KanColleBuilderConfig } from '../interfaces/kancolle-builder-config.interface'
import { KanColleConfigService } from './kancolle-config.service'

@Injectable()
export class KanColleBuilderService {
  private config: KanColleBuilderConfig = {
    lang: gkcoiLang.EN,
    theme: gkcoiTheme.DARK,
    f1: true,
    f2: false,
    f3: false,
    f4: false,
    lbas: false,
  }

  private configSubject = new BehaviorSubject<KanColleBuilderConfig>(this.config)

  constructor(
    private readonly zone: NgZone,
    private readonly snackBar: MatSnackBar,
    private readonly kcConfigService: KanColleConfigService,
  ) { }

  public getConfig() {
    const config = { ...this.config }
    return config
  }

  public getConfigObservable() {
    return this.configSubject.asObservable()
  }

  public setConfig(value: KanColleBuilderConfig) {
    Object.assign(this.config, value)
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

  public getDeckIdUrl(id: string) {
    const url = `${KanColleConstant.DECK_BASE_URL}${id}.json`
    return url
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
    // this.clearErrorIds(deckBuilder)
    return deckBuilder as DeckBuilder
  }

  /**
   * Temporary disable ids due to gkcoi generate error
   */
  private clearErrorIds(deck: any) {
    ['a1', 'a2', 'a3'].forEach(aKey => {
      const lbas = deck[aKey]
      if (!lbas?.items) { return }
      ['i1', 'i2', 'i3', 'i4'].forEach(iKey => {
        const item = lbas.items[iKey]
        if (!item?.id) { return }
        if (![452, 453].includes(item.id)) { return }
        item.id = 0
      })
    })
  }

  private getGenerateOptions() {
    const config = this.kcConfigService.getConfig()
    const options = !!config.useCustomOptions
      ? KanColleConstant.GKCOI_GENERATE_OPTIONS
      : undefined
    return options
  }
}
