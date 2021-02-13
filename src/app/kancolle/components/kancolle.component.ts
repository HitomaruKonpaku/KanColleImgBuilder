import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { BaseComponent } from '../../base/base.component'
import { KanColleConstant } from '../constants/kancolle.constant'
import { KanColleConfigService } from '../services/kancolle-config.service'

@Component({
  selector: 'app-kancolle',
  templateUrl: './kancolle.component.html',
})
export class KanColleComponent extends BaseComponent {
  constructor(
    private readonly http: HttpClient,
    private readonly kcConfigService: KanColleConfigService,
  ) {
    super()
  }

  async onInit() {
    await this.getConfig()
  }

  private async getConfig() {
    try {
      const res = await this.http.get(KanColleConstant.CONFIG_URL).toPromise()
      this.kcConfigService.setConfig(res)
    } catch (error) {
      // Ignore
    }
  }
}
