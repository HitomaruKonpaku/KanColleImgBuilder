import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { BaseComponent } from '../../../base/base.component'
import { gkcoiTheme } from '../../enums/gkcoi-theme.enum'
import { KanColleBuilderService } from '../../services/kancolle-builder.service'

@Component({
  selector: 'app-kancolle-builder-toolbar',
  templateUrl: './kancolle-builder-toolbar.component.html',
  styleUrls: ['./kancolle-builder-toolbar.component.scss'],
})
export class KanColleBuilderToolbarComponent extends BaseComponent {
  @Input() isLoading: boolean = false

  @Output() generate = new EventEmitter()

  public readonly FLEET_CHECKBOXS = [
    { formControlName: 'f1', label: '#1' },
    { formControlName: 'f2', label: '#2' },
    { formControlName: 'f3', label: '#3' },
    { formControlName: 'f4', label: '#4' },
    { formControlName: 'lbas', label: 'LBAS' },
  ]

  public themes: string[]
  public formGroup: FormGroup

  constructor(
    private readonly fb: FormBuilder,
    private readonly kcBuilderService: KanColleBuilderService,
  ) {
    super()
  }

  public submit() {
    const value = this.formGroup.value
    this.kcBuilderService.setConfig(value)
    this.generate.next()
  }

  onInit() {
    this.themes = Object.values(gkcoiTheme)
    this.formGroup = this.fb.group(this.kcBuilderService.getConfig())
    // this.formGroup.valueChanges.subscribe(value => {
    //   console.debug(value)
    // })
  }
}
