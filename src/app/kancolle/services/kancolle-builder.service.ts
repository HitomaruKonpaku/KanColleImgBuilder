import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { gkcoiTheme } from '../enums/gkcoi-theme.enum'
import { KanColleBuilderConfig } from '../interfaces/kancolle-builder-config.interface'

@Injectable()
export class KanColleBuilderService {
  private config: KanColleBuilderConfig = {
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

  public setTheme(value: gkcoiTheme) {
    const isValidValue = Object.values(gkcoiTheme).includes(value)
    if (!isValidValue) {
      return
    }
    this.config.theme = value
    this.emitConfig()
  }

  public setLbas(value: boolean) {
    this.config.lbas = value
    this.emitConfig()
  }

  private emitConfig() {
    this.configSubject.next(this.config)
  }
}
