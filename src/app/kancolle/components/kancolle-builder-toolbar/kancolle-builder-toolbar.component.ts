import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '../../../base/base.component';
import { KanColleBuilderService } from '../../services/kancolle-builder.service';

@Component({
  selector: 'app-kancolle-builder-toolbar',
  templateUrl: './kancolle-builder-toolbar.component.html',
  styleUrls: ['./kancolle-builder-toolbar.component.scss'],
})
export class KanColleBuilderToolbarComponent extends BaseComponent {
  @Output() generate = new EventEmitter();

  public title: string;
  public formGroup!: FormGroup

  constructor(
    private readonly fb: FormBuilder,
    private readonly kcBuilderService: KanColleBuilderService,
  ) {
    super()
    this.title = 'Fleets'
  }

  public submit() {
    const value = this.formGroup.value
    this.kcBuilderService.config = value
    this.generate.next()
  }

  onInit() {
    this.formGroup = this.fb.group({ ...this.kcBuilderService.config })
  }
}
