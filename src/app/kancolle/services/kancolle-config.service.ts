import { Injectable } from '@angular/core';

@Injectable()
export class KanColleConfigService {
  private config: any = {}

  public getConfig() {
    return { ...this.config }
  }

  public setConfig(value: any) {
    this.config = {
      ...this.config,
      ...value,
    }
  }
}
