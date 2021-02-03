import { Injectable } from '@angular/core'
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
  }

  public getConfig() {
    const config = { ...this.config }
    return config
  }

  public setConfig(value: KanColleBuilderConfig) {
    Object.assign(this.config, value)
  }

  public setTheme(value: gkcoiTheme) {
    const isValidValue = Object.values(gkcoiTheme).includes(value)
    if (!isValidValue) {
      return
    }
    this.config.theme = value
  }
}
