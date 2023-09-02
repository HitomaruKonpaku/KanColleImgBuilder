import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
import { BaseComponent } from '../../../base/base.component'
import { gkcoiLang } from '../../enums/gkcoi-lang.enum'
import { gkcoiTheme } from '../../enums/gkcoi-theme.enum'
import { KanColleBuilderService } from '../../services/kancolle-builder.service'

@Component({
  selector: 'app-kancolle-builder-toolbar',
  templateUrl: './kancolle-builder-toolbar.component.html',
  styleUrls: ['./kancolle-builder-toolbar.component.scss'],
})
export class KanColleBuilderToolbarComponent extends BaseComponent {
  @Input() isLoading = false

  @Output() imageGenerate = new EventEmitter()
  @Output() imageCopy = new EventEmitter()
  @Output() imageDownload = new EventEmitter()

  public readonly FLEET_CHECKBOXS = [
    { formControlName: 'f1', label: '#1' },
    { formControlName: 'f2', label: '#2' },
    { formControlName: 'f3', label: '#3' },
    { formControlName: 'f4', label: '#4' },
  ]

  public langs: string[]
  public themes: string[]
  public formGroup: FormGroup

  private configSubscription: Subscription

  constructor(
    private readonly fb: FormBuilder,
    private readonly kcBuilderService: KanColleBuilderService,
  ) {
    super()
  }

  onInit() {
    this.langs = Object.values(gkcoiLang)
    this.themes = Object.values(gkcoiTheme)
    this.formGroup = this.fb.group(this.kcBuilderService.getConfig())
    // this.formGroup.valueChanges.subscribe(value => {
    //   console.debug(value)
    // })

    this.configSubscription = this.kcBuilderService.getConfigObservable().subscribe(config => {
      this.formGroup.patchValue(config, { emitEvent: false })
    })

    this.formGroup.valueChanges.subscribe(value => {
      console.debug(value)
    })
  }

  onDestroy() {
    if (this.configSubscription) {
      this.configSubscription.unsubscribe()
    }
  }

  public onSubmit() {
    const value = this.formGroup.value
    this.kcBuilderService.setConfig(value)
    this.imageGenerate.next(null)
  }

  public onCopy() {
    this.imageCopy.next(null)
  }

  public onDownload() {
    this.imageDownload.next(null)
  }
}
