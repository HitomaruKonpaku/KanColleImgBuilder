import { HttpClient } from '@angular/common/http'
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { ActivatedRoute } from '@angular/router'
import { BaseComponent } from '../../../base/base.component'
import { KanColleBuilderService } from '../../services/kancolle-builder.service'

@Component({
  selector: 'app-kancolle-builder',
  templateUrl: './kancolle-builder.component.html',
  styleUrls: ['./kancolle-builder.component.scss'],
})
export class KanColleBuilderComponent extends BaseComponent {
  @ViewChild('drawer', { static: true }) drawer: MatDrawer
  @ViewChild('canvasContainer', { static: true }) canvasContainerElementRef: ElementRef

  public isLoading: boolean = false

  private deck: any

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly kcBuilderService: KanColleBuilderService,
  ) {
    super()
  }

  private get canvasContainer() {
    return this.canvasContainerElementRef.nativeElement as HTMLElement
  }

  public async generate() {
    if (!this.deck) {
      this.toggleLoading(false)
      return
    }

    this.toggleLoading(true)
    this.canvasContainer.innerHTML = ''

    try {
      const canvas = await this.kcBuilderService.generateCanvas(this.deck)
      this.canvasContainer.appendChild(canvas)
    } finally {
      this.toggleLoading(false)
    }
  }

  public download() {
    const canvas = this.canvasContainer.querySelector('canvas')
    if (!canvas) {
      return
    }

    const dataUrl = canvas.toDataURL()
    const anchor = document.createElement('a')
    anchor.download = 'download.png'
    anchor.href = dataUrl
    anchor.click()
  }

  async onInit() {
    this.initConfig()
    this.initData()
  }

  private initConfig() {
    if (!this.deck) {
      return
    }
    if (this.deck.lang) {
      this.kcBuilderService.setLang(this.deck.lang.toLowerCase())
    }
    if (this.deck.theme) {
      this.kcBuilderService.setTheme(this.deck.theme.toLowerCase())
    }
    if ([1, 2, 3].some(v => this.deck['a' + v])) {
      this.kcBuilderService.setLbas(true)
    }
  }

  private initData() {
    const routeSnapshot = this.route.snapshot
    const fragment = routeSnapshot.fragment
    this.initDeckFromDeck(fragment)
  }

  private async initDeckFromDeck(deckValue: string) {
    const value = JSON.parse(decodeURI(deckValue))
    await this.initDeck(value)
  }

  private async initDeckFromDeckId(deckId: string) {
    const url = this.kcBuilderService.getDeckIdUrl(deckId)
    const res: any = await this.http.get(url).toPromise()
    const value = JSON.parse(decodeURI(res.value))
    await this.initDeck(value)
  }

  private async initDeck(value: any) {
    console.debug(value)
    this.deck = value
    this.initConfig()
    await this.generate()
  }

  private toggleLoading(isLoading?: boolean) {
    this.isLoading = typeof isLoading === 'boolean'
      ? isLoading
      : !this.isLoading
    this.cdr.detectChanges()
  }
}
