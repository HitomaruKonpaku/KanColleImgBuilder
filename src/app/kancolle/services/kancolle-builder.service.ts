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
    this.clearErrorIds(deckBuilder)
    return deckBuilder as DeckBuilder
  }

  /**
   * Temporary disable ids due to gkcoi generate error
   */
  private clearErrorIds(deck: any) {
    const errorItemIds: string[] = [
      // 102, // Type 98 Reconnaissance Seaplane (Night Recon)
      // 469, // Type 0 Reconnaissance Seaplane Model 11B Kai (Night Recon)
    ];

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
}
