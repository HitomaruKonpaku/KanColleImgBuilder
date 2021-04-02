import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { KanColleConstant } from '../constants/kancolle.constant'
import { KanColleConfigService } from '../services/kancolle-config.service'

@Injectable()
export class KanColleBuilderConfigResolver implements Resolve<any> {
  constructor(
    private readonly http: HttpClient,
    private readonly kcConfigService: KanColleConfigService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.http.get(KanColleConstant.CONFIG_URL)
      .pipe(
        // tap(v => console.debug(v)),
        tap(v => this.kcConfigService.setConfig(v)),
        catchError(() => of({})),
      )
  }
}
