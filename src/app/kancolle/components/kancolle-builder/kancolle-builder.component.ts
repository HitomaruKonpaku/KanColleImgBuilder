import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/database'
import { from } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'
import { environment } from '../../../../environments/environment'
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

  private get database() {
    return firebase.database()
  }

  public async generate() {
    if (!this.deck) {
      this.toggleLoading(false)
      return
    }

    this.toggleLoading(true)
    this.canvasContainer.innerHTML = ''

    try {
      const deck = this.kcBuilderService.generateDeckBuilder(this.deck)
      const canvas = await this.kcBuilderService.generateCanvas(deck)
      this.canvasContainer.appendChild(canvas)
    } catch (error) {
      throw error
    } finally {
      this.toggleLoading(false)
    }
  }

  async onInit() {
    this.initFirebase()
    this.initConfig()
    this.initData()
  }

  private initFirebase() {
    firebase.initializeApp(environment.firebaseConfig)
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
    const params = this.route.snapshot.queryParams
    if (params.deckId) {
      this.initDeckFromDeckId(params.deckId)
      return
    }
    if (params.deck) {
      this.initDeckFromDeck(params.deck)
      return
    }
  }

  private initDeckFromDeckId(deckId: string) {
    const ref = `decks/${deckId}`
    this.toggleLoading(true)
    from(this.database.ref(ref).once('value'))
      .pipe(
        take(1),
        map(v => v.val()),
        catchError(error => {
          this.toggleLoading(false)
          throw error
        }),
      )
      .subscribe(v => {
        this.initDeck(v?.value)
        this.database.goOffline()
      })
  }

  private initDeckFromDeck(value: any) {
    this.initDeck(JSON.parse(decodeURI(value)))
  }

  private initDeck(value: any) {
    this.deck = value
    this.initConfig()
    this.generate()
  }

  private toggleLoading(isLoading?: boolean) {
    this.isLoading = typeof isLoading === 'boolean'
      ? isLoading
      : !this.isLoading
    this.cdr.detectChanges()
  }
}
