import { ChangeDetectorRef, Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { generate as gkcoi } from 'gkcoi'
import { BaseComponent } from '../../../base/base.component'
import { KanColleConstant } from '../../constants/kancolle.constant'
import { KanColleBuilderService } from '../../services/kancolle-builder.service'

@Component({
  selector: 'app-kancolle-builder',
  templateUrl: './kancolle-builder.component.html',
  styleUrls: ['./kancolle-builder.component.scss'],
})
export class KanColleBuilderComponent extends BaseComponent {
  public isLoading: boolean = false

  private container: HTMLElement
  private deck: any

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly kcBuilderService: KanColleBuilderService,
  ) {
    super()
  }

  public async generate() {
    this.isLoading = true
    this.container.innerHTML = ''

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

    try {
      const canvas = await gkcoi(deck)
      this.container.appendChild(canvas)
    } catch (error) {
      throw error
    } finally {
      this.isLoading = false
      this.cdr.detectChanges()
    }
  }

  async onInit() {
    this.initElements()
    this.initData()
    this.initConfig()
    await this.generate()
  }

  private initElements() {
    this.container = document.getElementById(KanColleConstant.BUILDER_CANVAS_CONTAINER_ID) as HTMLElement
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
}
