import { Injectable } from '@angular/core'
import { DeckBuilder } from 'gkcoi'
import { BehaviorSubject } from 'rxjs'
import { gkcoiLang } from '../enums/gkcoi-lang.enum'
import { gkcoiTheme } from '../enums/gkcoi-theme.enum'
import { KanColleBuilderConfig } from '../interfaces/kancolle-builder-config.interface'

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

  public generateDeckBuilder(baseDeckBuilder: any) {
    const deck = { ...baseDeckBuilder }
    Object.entries(this.config).forEach(([key, value]) => {
      if (['lang', 'theme'].includes(key)) {
        deck[key] = value
        return
      }
      if (key === 'lbas' && !value) {
        [1, 2, 3].forEach(v => delete deck['a' + v])
        return
      }
      if (typeof value === 'boolean' && !value) {
        delete deck[key]
      }
    })
    return deck as DeckBuilder
  }

  private emitConfig() {
    this.configSubject.next(this.config)
  }
}
