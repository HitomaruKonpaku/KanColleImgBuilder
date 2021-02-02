import { Injectable } from '@angular/core'
import { KanColleBuilderConfig } from '../interfaces/kancolle-builder-config.interface'

@Injectable()
export class KanColleBuilderService {
  private _config: KanColleBuilderConfig = {
    f1: true,
    f2: false,
    f3: false,
    f4: false,
  }

  public get config() {
    const config = { ...this._config }
    return config
  }

  public set config(value: KanColleBuilderConfig) {
    this._config = value
  }
}
