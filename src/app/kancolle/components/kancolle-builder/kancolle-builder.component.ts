import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { ActivatedRoute } from '@angular/router'
import { generate as gkcoi } from 'gkcoi'
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
      return
    }

    this.isLoading = true
    this.canvasContainer.innerHTML = ''

    try {
      const deck = this.getDeckBuilder()
      const canvas = await gkcoi(deck)
      this.canvasContainer.appendChild(canvas)
    } catch (error) {
      throw error
    } finally {
      this.isLoading = false
      this.cdr.detectChanges()
    }
  }

  async onInit() {
    this.initData()
    this.initConfig()
    await this.generate()
  }

  private initData() {
    const params = this.route.snapshot.queryParams
    const deckValue = params.deck
    if (!deckValue) {
      return
    }
    this.deck = JSON.parse(decodeURI(deckValue))
  }

  private initConfig() {
    if (this.deck?.theme) {
      this.kcBuilderService.setTheme(this.deck.theme)
    }
  }

  private getDeckBuilder() {
    const deck = { ...this.deck }
    Object.entries(this.kcBuilderService.getConfig()).forEach(([key, value]) => {
      if (key === 'theme') {
        deck.theme = value
      }
      if (typeof value === 'boolean') {
        if (!value) {
          delete deck[key]
        }
      }
    })
    return deck
  }
}
